



export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Image upload failed");
  }

  return result.imageUrl;
}
