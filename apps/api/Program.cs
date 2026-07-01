using Api.Features.AI;
using Api.Features.Onboarding;
using Api.Features.Website;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(IsLocalDevOrigin)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

static bool IsLocalDevOrigin(string origin)
{
    if (string.IsNullOrWhiteSpace(origin))
    {
        return false;
    }

    if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri) || uri.Scheme != "http")
    {
        return false;
    }

    var host = uri.Host;
    return host is "localhost" or "127.0.0.1"
        || host.StartsWith("192.168.")
        || host.StartsWith("10.");
}

var mongoConnectionString = builder.Configuration["MongoDB:ConnectionString"]!;
var mongoDatabaseName = builder.Configuration["MongoDB:DatabaseName"]!;

builder.Services.AddSingleton<IMongoDatabase>(_ =>
{
    var client = new MongoClient(mongoConnectionString);
    return client.GetDatabase(mongoDatabaseName);
});

builder.Services.AddHttpClient();
builder.Services.AddSingleton<AnthropicService>();
builder.Services.AddScoped<OrchestratorService>();
builder.Services.AddScoped<OnboardingOrchestratorService>();
builder.Services.AddScoped<OnboardingPlannerService>();
builder.Services.AddScoped<OnboardingService>();
builder.Services.AddScoped<WebsiteService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "api" }));

app.Run();
