package com.example.notification.util;

import com.example.notification.model.TicketEvent;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.kernel.pdf.PdfDocument;

import java.io.ByteArrayOutputStream;

public class PdfGenerator {
    public static byte[] generateTicketPdf(TicketEvent event) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("Train Ticket"));
        document.add(new Paragraph("Name: " + event.getFullName()));
        document.add(new Paragraph("Age: " + event.getAge()));
        document.add(new Paragraph("Email: " + event.getEmail()));
        document.add(new Paragraph("Ticket Number: " + event.getTicketNumber()));
        document.add(new Paragraph("Train: " + event.getTrainName()));
        document.add(new Paragraph("From: " + event.getSource()));
        document.add(new Paragraph("To: " + event.getDestination()));
        document.add(new Paragraph("Departure: " + event.getDepartureTime()));
        document.add(new Paragraph("Seats: " + event.getNoOfSeats()));
        document.add(new Paragraph("Order ID: " + event.getOrderId()));

        document.close();
        return baos.toByteArray();
    }
}