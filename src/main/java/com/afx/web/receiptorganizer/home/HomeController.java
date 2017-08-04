package com.afx.web.receiptorganizer.home;

import com.afx.web.receiptorganizer.login.LoginController;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;

@Controller
@RequestMapping("home")
public class HomeController {

    private static Logger logger = LogManager.getLogger(HomeController.class);

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView homeView(ModelMap model) {
        logger.debug("Serving user request for home screen.");

        //TODO remove hardcoding.
        //Labels
        ArrayList<Label> labels = new ArrayList<Label>();
        Label test = new Label();
        test.setLabelName("fakeLabel");
        test.setLabelText("Advance Auto");
        test.setLabelDescription("All receipts from Advance Auto Parts");
        Label other = new Label();
        other.setLabelName("otherLabel");
        other.setLabelText("O'Rielly's");
        other.setLabelDescription("All receipts from O'Rielly's");
        labels.add(test);
        labels.add(other);

        //Receipts
        ArrayList<Receipt> receipts = new ArrayList<Receipt>();
        Receipt testReceipt = new Receipt();
        testReceipt.setStore("Advance Auto");
        testReceipt.setTitle("Oil Filter and Coolant");
        testReceipt.setDate("9:27AM");
        receipts.add(testReceipt);

        HomeModel homeModel = new HomeModel();
        homeModel.setLabels(labels);
        homeModel.setReceipts(receipts);
        model.addAttribute(homeModel);

        return new ModelAndView("home", "model", model);
    }

}
