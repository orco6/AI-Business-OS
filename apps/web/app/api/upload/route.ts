import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { images, category, profileId } = await request.json() as {
      images: string[];
      category: string;
      profileId: string;
    };

    const uploadPromises = images.map((base64Image: string) =>
      cloudinary.uploader.upload(base64Image, {
        folder: `ai-business-os/${profileId}/${category}`,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      })
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map((result) => result.secure_url);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
