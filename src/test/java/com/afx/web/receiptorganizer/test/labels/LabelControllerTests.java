package com.afx.web.receiptorganizer.test.labels;

import com.afx.web.receiptorganizer.config.ApplicationConfig;
import com.afx.web.receiptorganizer.dao.label.LabelDao;
import com.afx.web.receiptorganizer.test.utils.TestUtils;
import com.afx.web.receiptorganizer.types.Label;
import com.afx.web.receiptorganizer.types.User;
import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.mock.jndi.SimpleNamingContextBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.naming.NamingException;

import java.util.Locale;

import static org.junit.Assert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestContext.class, ApplicationConfig.class})
@WebAppConfiguration
public class LabelControllerTests {

    private MockMvc mockMvc;

    @Autowired
    private LabelDao labelDaoMock;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeClass
    public static void classSetup() throws NamingException {
        SimpleNamingContextBuilder builder = new SimpleNamingContextBuilder();
        SQLServerDataSource ds = new SQLServerDataSource();
        ds.setUser(System.getenv("USERNAME"));
        ds.setPassword(System.getenv("PASSWORD"));
        ds.setServerName(System.getenv("SERVER_NAME"));
        ds.setPortNumber(Integer.valueOf(System.getenv("SERVER_PORT")));
        ds.setDatabaseName(System.getenv("DATABASE_NAME"));

        builder.bind("java:/MSSQLDS", ds);
        builder.activate();
    }

    @Before
    public void setUp() {
        Mockito.reset(labelDaoMock);
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void createLabel_ShouldCreateNewLabelWithInputName() throws Exception {
        String username = "TestUsername";
        String labelName = "Test";

        User user = new User();
        user.setUsername(username);

        mockMvc.perform((post("/labels/create")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("name", labelName)
                .sessionAttr("user", user))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(TestUtils.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath("$.success", is(true)))
            .andExpect(jsonPath("$.errorMessage", is(messageSource.getMessage("label.add.success",
                    null,
                    Locale.US))));

        ArgumentCaptor<Label> labelArgumentCaptor = ArgumentCaptor.forClass(Label.class);
        ArgumentCaptor<String> usernameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(labelDaoMock, times(1)).addLabel(usernameArgumentCaptor.capture(), labelArgumentCaptor.capture());
        verifyNoMoreInteractions(labelDaoMock);

        Label formObject = labelArgumentCaptor.getValue();
        assertThat(formObject.getName(), is("Test"));

        String formUsername = usernameArgumentCaptor.getValue();
        assert(formUsername.equals("TestUsername"));
    }
}
