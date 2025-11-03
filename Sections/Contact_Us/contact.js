// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector(".contact-form form");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const firstName = form
//       .querySelector('input[placeholder="John"]')
//       .value.trim();
//     const lastName = form
//       .querySelector('input[placeholder="Doe"]')
//       .value.trim();
//     const email = form.querySelector('input[type="email"]').value.trim();
//     const phone = form
//       .querySelector('input[placeholder="+1012 3456 789"]')
//       .value.trim();
//     const subject = form
//       .querySelector('input[name="subject"]:checked')
//       .parentElement.textContent.trim();
//     const message = form.querySelector("textarea").value.trim();

//     if (!firstName || !lastName || !email || !message) {
//       alert("Please fill in all required fields!");
//       return;
//     }

//     const contactData = {
//       firstName,
//       lastName,
//       email,
//       phone,
//       subject,
//       message,
//       submittedAt: new Date().toISOString(),
//     };

//     try {
//       const response = await fetch("/data/contact.json", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(contactData),
//       });

//       if (!response.ok) throw new Error("Failed to save data");

//       const result = await response.json();
//       console.log(" Saved:", result);
//       alert("Data berhasil ditambahkan ke contact.json!");
//       form.reset();
//     } catch (error) {
//       console.error(" Error saving data:", error);
//       alert("Terjadi kesalahan saat menyimpan data.");
//     }
//   });
// });
