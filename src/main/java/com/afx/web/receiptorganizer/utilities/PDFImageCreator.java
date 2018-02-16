package com.afx.web.receiptorganizer.utilities;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.icepdf.core.exceptions.PDFException;
import org.icepdf.core.exceptions.PDFSecurityException;
import org.icepdf.core.pobjects.Document;
import org.icepdf.core.pobjects.Page;
import org.icepdf.core.util.GraphicsRenderingHints;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

public class PDFImageCreator {

    private static Logger logger = LogManager.getLogger(PDFImageCreator.class);

    /*
    Public static utility methods
     */


    /**
     * Creates images from PDF files using ICEPDF.
     *
     * @param input
     *      InputStream containing a pdf file
     * @param pathOrUrl
     *      Name of the pdf file
     * @param pageNumber
     *      Page number to create an image from
     * @return
     *      The image of the @input's pageNumber page.
     */
    public static BufferedImage createImageOfPDFPage(InputStream input, String pathOrUrl, int pageNumber) throws IOException {
        BufferedImage image;
        try {
            Document pdfDocument = new Document();

            try {
                pdfDocument.setInputStream(input, pathOrUrl);
            } catch (PDFException ex) {
                logger.error("Error parsing PDF document " + ex);
                throw new IOException();
            } catch (PDFSecurityException ex) {
                logger.error("Error encryption not supported " + ex);
                throw new IOException();
            } catch (IOException ex) {
                logger.error("Error IOException " + ex);
                throw new IOException();
            }

            // save page captures to file.
            float scale = 1.0f;
            float rotation = 0f;

            //Create an image from only the first page of the PDF.
            image = (BufferedImage) pdfDocument.getPageImage(
                        pageNumber, GraphicsRenderingHints.PRINT, Page.BOUNDARY_CROPBOX, rotation, scale);

            // clean up resources
            pdfDocument.dispose();
        } catch (InterruptedException ie) {
            logger.error("Error creating image from PDF document " + ie);
            throw new IOException();
        }

        return image;
    }
}
