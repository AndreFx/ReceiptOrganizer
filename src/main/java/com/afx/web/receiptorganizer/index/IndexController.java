package com.afx.web.receiptorganizer.index;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class IndexController {

    /*
     * Constants
     */

    
    /*
     * Private static variables
     */

    private static Logger logger = LogManager.getLogger(IndexController.class);

    /*
     * Private fields
     */

    /*
     * Binding methods
     */

    /*
     * Controller methods
     */

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "index";
    }
}
