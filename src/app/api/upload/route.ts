
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be under 5MB" },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.url,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
