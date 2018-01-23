package com.afx.web.receiptorganizer.receipts;

import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.dao.receipt.ReceiptDao;
import com.afx.web.receiptorganizer.types.*;
import com.afx.web.receiptorganizer.exceptions.types.ReceiptNotFoundException;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.utilities.ImageThumbnailCreator;
import com.afx.web.receiptorganizer.utilities.PDFImageCreator;
import com.asprise.ocr.Ocr;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("receipts")
@SessionAttributes(value={"user"})
public class ReceiptController {

    /*
    Constants
     */

    private static final int THUMBNAIL_HEIGHT = 84;
    private static final int THUMBNAIL_MAX_WIDTH = 175;

    /*
    Private static variables
     */

    private static Logger logger = LogManager.getLogger(ReceiptController.class);
    private static HashMap<String, HashMap<Integer, byte[]>> userReceiptImageCache = new HashMap<>();

    /*
    Private fields
     */

    @Autowired
    private ReceiptDao receiptDao;

    @Autowired
    private LabelDao labelDao;


    /*
    Binding methods
     */

    @InitBinder("newReceipt")
    public void newReceiptInitBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    @InitBinder("receipt")
    public void receiptEditInitBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    /*
    Controller methods
     */

    @RequestMapping(value = "/{receiptId}", method = RequestMethod.GET)
    public String showReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, ModelMap model) {
        logger.debug("User: " + user.getUsername() + " viewing receipt with id: " + id);
        List<Label> labels = this.labelDao.getAllUserLabels(user.getUsername());
        Receipt receipt = this.receiptDao.getReceipt(user.getUsername(), id);
        if (receipt == null) {
            throw new ReceiptNotFoundException(id);
        }

        model.addAttribute("userLabels", labels);
        model.addAttribute("receipt", receipt);
        model.addAttribute("newReceipt", new Receipt());
        model.addAttribute("newLabel", new Label());
        model.addAttribute("receiptId", id);

        return "receipt-view";
    }

    @RequestMapping(value = "/{receiptId}/image", method = RequestMethod.GET)
    public void getReceiptImage(@PathVariable(value = "receiptId") int id,
                                @RequestParam("thumbnail") boolean scale,
                                @ModelAttribute("user") User user,
                                HttpServletResponse response) {
        logger.debug("User: " + user.getUsername() + " requesting image for receipt: " + id);

        try {
            ReceiptFile receiptImage;
            InputStream in;

            if (scale) {
                receiptImage = this.receiptDao.getReceiptImage(user.getUsername(), id, true);
            } else {
                receiptImage = this.receiptDao.getReceiptImage(user.getUsername(), id, false);
            }

            in = new ByteArrayInputStream(receiptImage.getReceiptFile());
            response.setContentType(receiptImage.getMIME());
            response.setHeader("content-Disposition", "inline; filename=" + id + "image.jpeg");
            response.setContentLength(receiptImage.getReceiptFile().length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch(IOException e) {
            logger.error("Unable to send image id: " + id + " response to user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}/file", method = RequestMethod.GET)
    public void getReceiptFile(@PathVariable(value = "receiptId") int id,
                                @ModelAttribute("user") User user,
                                HttpServletResponse response) {
        logger.debug("User: " + user.getUsername() + " requesting file for receipt: " + id);

        try {
            InputStream in;
            ReceiptFile receiptFile = this.receiptDao.getReceiptFile(user.getUsername(), id);

            in = new ByteArrayInputStream(receiptFile.getReceiptFile());

            String s = "content-Disposition";
            if (!receiptFile.getMIME().equals("application/pdf")) {
                response.setContentType(receiptFile.getMIME());
                response.setHeader(s, "inline; filename=" + id + "image.jpeg");
            } else {
                response.setContentType(receiptFile.getMIME());
                response.setHeader(s, "inline; filename=" + id + "file.pdf");
            }

            response.setContentLength(receiptFile.getReceiptFile().length);
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
            in.close();
        } catch(IOException e) {
            logger.error("Unable to send image id: " + id + " response to user: " + user.getUsername());
        }
    }

    @RequestMapping(value = "/{receiptId}/update", method = RequestMethod.POST)
    public String updateReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user, @ModelAttribute("receipt") Receipt receipt) {
        logger.debug("User: " + user.getUsername() + " updating receipt with id: " + id);
        receipt.setReceiptId(id);
        receipt.setMIME(receipt.getMultipartFile().getContentType());

        try {
            //Create byte array for transfer to database.
            if (receipt.getMultipartFile() != null && !receipt.getMultipartFile().isEmpty()) {

                BufferedImage image;
                if (receipt.getMultipartFile().getContentType().equals("application/pdf")) {
                    image = PDFImageCreator.createImageOfPDFPage(receipt.getMultipartFile().getInputStream(),
                            "receipt.pdf", 0);
                    receipt.setReceiptPDF(receipt.getMultipartFile().getBytes());
                } else {
                    image = ImageIO.read(receipt.getMultipartFile().getInputStream());
                }

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "jpeg", outputStream);
                outputStream.flush();
                byte[] imageAsBytes = outputStream.toByteArray();
                outputStream.close();
                receipt.setReceiptFullImage(imageAsBytes);

                //Create byte array for thumbnail
                long startTime = System.nanoTime();
                receipt.setReceiptThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_MAX_WIDTH));
                long endTime = System.nanoTime();
                long duration = (endTime - startTime) / 1000000;
                logger.debug("Time to scale receipt image of size: " + imageAsBytes.length + " into a thumbnail: " + duration + "ms");

                //Update image cache.
                if (!userReceiptImageCache.containsKey(user.getUsername().toLowerCase())) {
                    userReceiptImageCache.put(user.getUsername().toLowerCase(), new HashMap<>());
                }
                userReceiptImageCache.get(user.getUsername().toLowerCase()).put(id, imageAsBytes);
            }

            //Remove invalid receipt item entries
            receipt.removeInvalidReceiptItems();

            this.receiptDao.editReceipt(user.getUsername(), receipt);

            logger.debug("User: " + user.getUsername() + " successfully uploaded image.");
        } catch (DataAccessException e) {
            logger.error("User: " + user.getUsername() + " failed to upload file: " + receipt.getMultipartFile().getName());
            logger.error("Error description: " + e.getMessage());
            throw new ReceiptNotFoundException(id);
        } catch (IOException iox) {
            logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
            throw new RuntimeException(iox.getMessage());
        }

        return "redirect:/home/";
    }

    @RequestMapping(value = "/{receiptId}/delete", method = RequestMethod.POST)
    public String deleteReceipt(@PathVariable(value = "receiptId") int id, @ModelAttribute("user") User user) {
        logger.debug("User: " + user.getUsername() + " deleting receipt with id: " + id);

        //Update image cache.
        if (userReceiptImageCache.containsKey(user.getUsername().toLowerCase()) &&
                userReceiptImageCache.get(user.getUsername().toLowerCase()).containsKey(id)) {
            userReceiptImageCache.get(user.getUsername().toLowerCase()).remove(id);
        }

        this.receiptDao.deleteReceipt(user.getUsername(), id);

        return "redirect:/home/";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createReceipt(@ModelAttribute("user") User user, @ModelAttribute("newReceipt") Receipt newReceipt, RedirectAttributes ra) {
        logger.debug("User: " + user.getUsername() + " creating new receipt with title: " + newReceipt.getTitle());
        newReceipt.setMIME(newReceipt.getMultipartFile().getContentType());

        if (newReceipt.getMultipartFile() != null && !newReceipt.getMultipartFile().isEmpty()) {
            try {
                BufferedImage image;
                if (newReceipt.getMIME().equals("application/pdf")) {
                    image = PDFImageCreator.createImageOfPDFPage(newReceipt.getMultipartFile().getInputStream(),
                            "receipt.pdf", 0);
                    newReceipt.setReceiptPDF(newReceipt.getMultipartFile().getBytes());
                } else {
                    image = ImageIO.read(newReceipt.getMultipartFile().getInputStream());
                }

                //TODO This only needs to be done this way if the image is a pdf.
                //Create byte array for source image
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "jpeg", outputStream);
                outputStream.flush();
                byte[] imageAsBytes = outputStream.toByteArray();
                outputStream.close();
                newReceipt.setReceiptFullImage(imageAsBytes);

                //Create byte array for thumbnail
                long startTime = System.nanoTime();
                newReceipt.setReceiptThumbnail(ImageThumbnailCreator.createThumbnail(image, THUMBNAIL_HEIGHT, THUMBNAIL_MAX_WIDTH));
                long endTime = System.nanoTime();
                long duration = (endTime - startTime) / 1000000;
                logger.debug("Time to scale receipt image of size: " + imageAsBytes.length + " into a thumbnail: " + duration + "ms");

                //Remove invalid receipt item entries
                newReceipt.removeInvalidReceiptItems();

                //TODO Test OCR
                try {
                    ocr(newReceipt.getMultipartFile().getName(), newReceipt.getMultipartFile().getContentType(), newReceipt.getMultipartFile().getBytes());
                } catch (Exception e) {
                    System.out.println(e.toString());
                }

                this.receiptDao.addReceipt(user.getUsername(), newReceipt);

                logger.debug("User: " + user.getUsername() + " successfully uploaded image.");
            } catch (DataAccessException e) {
                logger.error("User: " + user.getUsername() + " failed to upload file: " + newReceipt.getMultipartFile().getName());
                logger.error("Error description: " + e.getMessage());
                throw e;
            } catch (IOException iox) {
                logger.error("Failed to convert user: " + user.getUsername() + " image for storage on database.");
                throw new RuntimeException(iox.getMessage());
            }
        } else {
            logger.info("User: " + user.getUsername() + " attempted to upload empty file.");
        }

        return "redirect:/home/";
    }

    /*
    Public static utility methods
     */

    public static void removeUserFromCache(String username) {
        if (userReceiptImageCache.containsKey(username.toLowerCase())) {
            logger.debug("Clearing: " + username + " from receipt image cache.");
            userReceiptImageCache.remove(username.toLowerCase());
        }
    }

    private static void ocr(String name, String contentType, byte[] imageAsBytes) throws Exception {
        //TODO Determine if i want to use asprise or abbyy web ocr
        File tempFile = File.createTempFile(name, ".pdf", null);
        FileOutputStream fos = new FileOutputStream(tempFile);
        fos.write(imageAsBytes);
        fos.close();


        Ocr.setUp();

        Ocr ocr = new Ocr();
        ocr.startEngine("eng", Ocr.SPEED_FASTEST);
        String s = ocr.recognize(new File[] {tempFile}, Ocr.RECOGNIZE_TYPE_TEXT, Ocr.OUTPUT_FORMAT_PLAINTEXT);

        boolean success = tempFile.delete();

        logger.info("OCR output:" + s);
//
//
//        BytePointer outText;
//
//        tesseract.TessBaseAPI api = new tesseract.TessBaseAPI();
//        // Initialize tesseract-ocr with English, without specifying tessdata path
//        if (api.Init("C:", "ENG") != 0) {
//            System.err.println("Could not initialize tesseract.");
//            System.exit(1);
//        }
//
//        // Open input image with leptonica library
//        lept.PIX image = pixRead(tempFile.getAbsolutePath());
//        api.SetImage(image);
//        // Get OCR result
//        outText = api.GetUTF8Text();
//        String string = outText.getString();
//        System.out.println("OCR output:\n" + string);
//
//        // Destroy used object and release memory
//        api.End();
//        outText.deallocate();
//        pixDestroy(image);
    }
}
