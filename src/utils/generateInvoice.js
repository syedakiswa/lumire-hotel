import { jsPDF } from "jspdf";

export function generateBookingInvoice(booking) {
  if (!booking) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryGold = [217, 155, 38]; // #d99b26
  const darkBlack = [18, 18, 18]; // #121212
  const textDark = [40, 40, 40];
  const textGray = [110, 110, 110];

  // Header Banner
  doc.setFillColor(...darkBlack);
  doc.rect(0, 0, 210, 45, "F");

  // Gold accent bar
  doc.setFillColor(...primaryGold);
  doc.rect(0, 45, 210, 3, "F");

  // Brand title
  doc.setTextColor(217, 155, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("LUMIÈRE GRAND HOTEL", 20, 22);

  // Subtitle
  doc.setTextColor(220, 220, 220);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Official Reservation Invoice & Guest Receipt", 20, 30);

  // Invoice Number top right
  doc.setTextColor(217, 155, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("INVOICE", 155, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(booking.bookingId || "LMG-0000", 155, 28);

  // Status Badge
  const status = booking.status || "Confirmed";
  doc.setFillColor(34, 197, 94); // Green
  if (status === "Cancelled") doc.setFillColor(239, 68, 68);
  if (status === "Pending") doc.setFillColor(234, 179, 8);
  doc.roundedRect(155, 32, 35, 7, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(status.toUpperCase(), 172.5, 36.8, { align: "center" });

  // Guest & Booking Details
  let y = 60;

  // Left Column - Guest Details
  doc.setTextColor(...primaryGold);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO:", 20, y);

  doc.setTextColor(...textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(booking.user?.name || "Valued Guest", 20, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textGray);
  doc.text(`Email: ${booking.user?.email || "N/A"}`, 20, y + 13);
  if (booking.user?.phone) {
    doc.text(`Phone: ${booking.user.phone}`, 20, y + 19);
  }

  // Right Column - Booking Info
  doc.setTextColor(...primaryGold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BOOKING DETAILS:", 120, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textDark);
  doc.setFontSize(9.5);
  const bookingDate = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US");

  doc.text(`Booking Reference: ${booking.bookingId || "N/A"}`, 120, y + 7);
  doc.text(`Issued Date: ${bookingDate}`, 120, y + 13);
  doc.text(`Payment Status: Completed / Guaranteed`, 120, y + 19);

  // Table of reservation items
  y = 95;

  // Table Header
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, 170, 9, "F");

  doc.setTextColor(...darkBlack);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ROOM DESCRIPTION", 25, y + 6);
  doc.text("DATES & DURATION", 90, y + 6);
  doc.text("GUESTS", 140, y + 6);
  doc.text("TOTAL", 175, y + 6, { align: "right" });

  // Table Row
  y += 11;
  const roomName = booking.room?.name || "Luxury Suite";
  const checkIn = booking.checkIn
    ? new Date(booking.checkIn).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
  const checkOut = booking.checkOut
    ? new Date(booking.checkOut).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
  const nights = booking.numberOfNights || 1;
  const rate = booking.pricePerNight || (booking.totalAmount ? booking.totalAmount / nights : 0);
  const total = booking.totalAmount || nights * rate;

  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(roomName, 25, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...textGray);
  doc.text(`${rate ? `$${rate} / night` : "Price on request"}`, 25, y + 10);

  // Dates & Duration
  doc.setTextColor(...textDark);
  doc.text(`${checkIn} to`, 90, y + 5);
  doc.text(`${checkOut} (${nights} night${nights > 1 ? "s" : ""})`, 90, y + 10);

  // Guests
  doc.text(`${booking.guests || "2 Guests"}`, 140, y + 5);

  // Total
  doc.setFont("helvetica", "bold");
  doc.text(total ? `$${total.toLocaleString("en-US")}` : "On Request", 175, y + 6, {
    align: "right",
  });

  // Table Border Bottom
  doc.setDrawColor(220, 220, 220);
  doc.line(20, y + 16, 190, y + 16);

  // Totals Box
  y += 24;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(110, y, 80, 42, 2, 2, "F");

  doc.setFontSize(9);
  doc.setTextColor(...textGray);
  doc.setFont("helvetica", "normal");
  doc.text("Room Subtotal:", 115, y + 9);
  doc.text(total ? `$${total.toLocaleString("en-US")}` : "$0.00", 185, y + 9, {
    align: "right",
  });

  doc.text("Taxes & Luxury Resort Fee (0%):", 115, y + 17);
  doc.text("$0.00", 185, y + 17);

  doc.setDrawColor(210, 210, 210);
  doc.line(115, y + 23, 185, y + 23);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryGold);
  doc.text("TOTAL PAID:", 115, y + 33);
  doc.text(total ? `$${total.toLocaleString("en-US")}` : "On Request", 185, y + 33, {
    align: "right",
  });

  // Hotel Policies & Terms
  const policyY = y + 55;
  doc.setTextColor(...darkBlack);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("HOTEL POLICIES & TERMS", 20, policyY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text("• Check-in time begins at 3:00 PM. Check-out time is by 12:00 PM noon.", 20, policyY + 6);
  doc.text("• Please present a valid government-issued photo ID upon arrival at the lobby reception.", 20, policyY + 11);
  doc.text("• Cancellation policy: Reservations may be modified or cancelled through your Lumière guest portal.", 20, policyY + 16);
  doc.text("• 24/7 dedicated concierge service is available for airport transfers, reservations, and dining requests.", 20, policyY + 21);

  // Footer Note
  const footerY = 270;
  doc.setDrawColor(...primaryGold);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, 190, footerY);

  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text("LUMIÈRE GRAND HOTEL • 123 Luxury Avenue, Downtown • info@lumieregrand.com • +1 (000) 123-4567", 105, footerY + 6, {
    align: "center",
  });
  doc.text("Thank you for choosing Lumière Grand Hotel. We eagerly look forward to hosting you.", 105, footerY + 11, {
    align: "center",
  });

  // Download PDF
  const filename = `Lumiere_Invoice_${booking.bookingId || "Reservation"}.pdf`;
  doc.save(filename);
}
