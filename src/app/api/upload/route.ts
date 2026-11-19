
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "ImgBB API key is missing." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image." },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: result.error?.message || "Image upload failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.url,
    });

  } catch (error) {
    console.error("ImgBB upload error:", error);

    return NextResponse.json(
      { message: "Something went wrong during image upload." },
      { status: 500 }
    );
  }
}
