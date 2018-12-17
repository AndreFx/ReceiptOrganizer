package com.afx.web.receiptorganizer.service.receipt.receiptparser.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.afx.web.receiptorganizer.dao.model.receipt.Receipt;
import com.afx.web.receiptorganizer.dao.model.receipt.ReceiptItem;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.LogoAndDocumentResponse;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.ReceiptParser;
import com.afx.web.receiptorganizer.service.receipt.receiptparser.ReceiptParserBase;

public class AdvanceAutoReceiptParser extends ReceiptParserBase implements ReceiptParser  {

    /*
    Constants
     */

    private static final String DATE_REGEX = "(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/[0-9]{4}";
    private static final String TOTAL_REGEX =
            "(?:[^S][^u][^b]\\s*)(?:(?:Total)|(?:total))\\s*\\$(-?[0-9]+\\.\\s*[0-9]{2})";
    private static final String TAX_REGEX = "(?:T1\\s*Tax\\s*@\\s*\\d\\.?\\d*%)\\s*\\$([0-9]+\\.[0-9]{2})";
    private static final String ITEM_REGEX =
            "(.*(?<!#\\s|#\\s\\d)(?:\\d{8}|\\d{7}))\\s+.*\\s*(\\d*)?\\s*\\$?(\\d*\\.\\d{2}|\\d*\\s*\\d{2})";
    private static final String WHITESPACE_FINDER = "\\s";

    /*
    Constructors
     */

    public AdvanceAutoReceiptParser(int thumbnailHeight, int thumbnailWidth, int maxDescriptionLength) {
        super(thumbnailHeight, thumbnailWidth, maxDescriptionLength);
    }

    /*
    ReceiptParser implementation
     */

    //This could potentially be several different methods, one for each autofill
    @Override
    public Receipt parseReceipt(Receipt receipt, LogoAndDocumentResponse visionResponse) throws IOException {
        Receipt data = super.parseReceipt(receipt, visionResponse);

        //Get date
        Matcher dateM = Pattern.compile(DATE_REGEX).matcher(visionResponse.getDocumentText());

        if (dateM.find()) {
            String match = dateM.group();
            SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
            try {
                data.setDate(formatter.parse(match));
            } catch (ParseException pe) {
                logger.error("Unable to parse date for receipt.");
            }
        }

        //Get total
        Matcher totalM = Pattern.compile(TOTAL_REGEX).matcher(visionResponse.getDocumentText());
        if (totalM.find()) {
            String match = totalM.group(totalM.groupCount());
            Matcher whitespaceChecker = Pattern.compile(WHITESPACE_FINDER).matcher(match);
            if (whitespaceChecker.find()) {
                match = match.replaceAll("(\\d+)\\.\\s*(\\d+)", "$1.$2");
            }

            try {
                data.setTotal(new BigDecimal(match));
            } catch (NumberFormatException nfe) {
                logger.info("Unable to convert: " + match + " to BigDecimal for receipt total.");
                data.setTotal(new BigDecimal("0.00"));
            }
        }

        //Get tax
        Matcher taxM = Pattern.compile(TAX_REGEX).matcher(visionResponse.getDocumentText());
        if (taxM.find()) {
            String match = taxM.group(taxM.groupCount());
            try {
                data.setTax(new BigDecimal(match));
            } catch (NumberFormatException nfe) {
                logger.info("Unable to convert: " + match + " to BigDecimal for receipt tax.");
                data.setTax(new BigDecimal("0.00"));
            }
        }

        //Get items
        ArrayList<ReceiptItem> items = new ArrayList<>();

        //Items
        Matcher itemM = Pattern.compile(ITEM_REGEX).matcher(visionResponse.getDocumentText());
        int i = 0;
        while (itemM.find()) {
            ReceiptItem item = new ReceiptItem();

            String nameMatch = itemM.group(1);
            String quantityMatch = itemM.group(2);
            String priceMatch = itemM.group(3);
            item.setName(nameMatch);
            item.setItemNumber(i);

            try {
                item.setQuantity(Integer.valueOf(quantityMatch));
            } catch (NumberFormatException nfe) {
                logger.info("Unable to convert: " + quantityMatch + " to Integer for item quantity.");
            }

            Matcher whitespaceChecker = Pattern.compile(WHITESPACE_FINDER).matcher(priceMatch);
            if (whitespaceChecker.find()) {
                priceMatch = priceMatch.replaceAll("(\\d+)\\s*(\\d+)", "$1.$2");
            }

            try {
                item.setUnitPrice(new BigDecimal(priceMatch));
            } catch (NumberFormatException nfe) {
                logger.info("Unable to convert: " + priceMatch + " to Integer for item price.");
                item.setUnitPrice(new BigDecimal("0.00"));
            }

            items.add(item);
            i++;
        }

        data.setItems(items);

        return data;
    }

}
