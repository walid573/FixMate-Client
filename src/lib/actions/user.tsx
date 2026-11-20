


export async function changeRole(userId: string, nextRole: string) {
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/role`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      }
   
)}