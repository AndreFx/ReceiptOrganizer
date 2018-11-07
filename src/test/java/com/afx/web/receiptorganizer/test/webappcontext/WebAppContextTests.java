package com.afx.web.receiptorganizer.test.webappcontext;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.naming.NamingException;

import com.afx.web.receiptorganizer.config.ApplicationConfig;
import com.afx.web.receiptorganizer.dao.model.label.Label;
import com.afx.web.receiptorganizer.dao.model.user.User;
import com.afx.web.receiptorganizer.service.label.LabelService;
import com.afx.web.receiptorganizer.test.utils.TestUtils;
import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.dao.DataAccessException;
import org.springframework.mock.jndi.SimpleNamingContextBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestContext.class, ApplicationConfig.class})
@PropertySource("classpath:application.properties")
@WebAppConfiguration
public class WebAppContextTests {

    private static final String LABEL_CREATE_PATH = "/labels/create";
    private static final String LABEL_INDEX_PATH = "/labels/";

    private static final String RESP_RESULT = "$.success";
    private static final String RESP_MSG = "$.message";

    private MockMvc mockMvc;

    @Autowired
    private LabelService labelServiceMock;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private User user = new User();

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
        Mockito.reset(labelServiceMock);
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        this.user.setUsername("TestUsername");
    }

    @Test
    public void createLabel_ShouldCreateNewLabelWithInputName() throws Exception {
        //Setup
        Label label = new Label();
        String labelName = "Test";
        label.setName(labelName);
        String json = TestUtils.serialize(label);

        //Test
        mockMvc.perform((post(LABEL_CREATE_PATH)
                .contentType(TestUtils.APPLICATION_JSON_UTF8)
                .content(json)
                .sessionAttr("user", this.user))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(TestUtils.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath(RESP_RESULT, is(true)))
            .andExpect(jsonPath(RESP_MSG, is(messageSource.getMessage("label.create.success",
                    null,
                    Locale.US))));

        //Assert
        ArgumentCaptor<Label> labelArgumentCaptor = ArgumentCaptor.forClass(Label.class);
        ArgumentCaptor<String> usernameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(labelServiceMock, times(1)).addLabel(usernameArgumentCaptor.capture(), labelArgumentCaptor.capture());
        verifyNoMoreInteractions(labelServiceMock);

        Label formObject = labelArgumentCaptor.getValue();
        assertThat(formObject.getName(), is(labelName));

        String formUsername = usernameArgumentCaptor.getValue();
        assert(formUsername.equals(this.user.getUsername()));
    }

    @Test
    public void createLabel_ShouldSendNotUniqueResponseWhenDataAccessExceptionThrown() throws Exception {
        //Setup
        Label label = new Label();
        String labelName = "Test";
        label.setName(labelName);
        String json = TestUtils.serialize(label);

        doThrow(new DataAccessException("Dao Exception...") {})
                .when(labelServiceMock)
                .addLabel(anyString(), any(Label.class));

        mockMvc.perform((post(LABEL_CREATE_PATH)
                .contentType(TestUtils.APPLICATION_JSON_UTF8)
                .content(json)
                .sessionAttr("user", this.user))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(TestUtils.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath(RESP_RESULT, is(false)))
            .andExpect(jsonPath(RESP_MSG, is(messageSource.getMessage("label.create.failure.notunique",
                    null,
                    Locale.US))));

        ArgumentCaptor<Label> labelArgumentCaptor = ArgumentCaptor.forClass(Label.class);
        ArgumentCaptor<String> usernameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(labelServiceMock, times(1)).addLabel(usernameArgumentCaptor.capture(), labelArgumentCaptor.capture());
        verifyNoMoreInteractions(labelServiceMock);

        Label formObject = labelArgumentCaptor.getValue();
        assertThat(formObject.getName(), is(labelName));

        String formUsername = usernameArgumentCaptor.getValue();
        assert(formUsername.equals(this.user.getUsername()));
    }

    @Test
    public void createLabel_EmptyNameShouldReturnInvalidNameResponse() throws Exception {
        //Setup
        Label label = new Label();
        String labelName = "";
        label.setName(labelName);
        String json = TestUtils.serialize(label);

        mockMvc.perform((post(LABEL_CREATE_PATH)
                .contentType(TestUtils.APPLICATION_JSON_UTF8)
                .content(json)
                .sessionAttr("user", this.user))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(TestUtils.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath(RESP_RESULT, is(false)))
            .andExpect(jsonPath(RESP_MSG, is(messageSource.getMessage("label.create.failure.invalid",
                    null,
                    Locale.US))));

        verify(labelServiceMock, never()).addLabel(anyString(), any());
    }

    @Test
    public void createLabel_BlankNameShouldReturnInvalidNameResponse() throws Exception {
        //Setup
        Label label = new Label();
        String labelName = "    ";
        label.setName(labelName);
        String json = TestUtils.serialize(label);

        mockMvc.perform((post(LABEL_CREATE_PATH)
                .contentType(TestUtils.APPLICATION_JSON_UTF8)
                .content(json)
                .sessionAttr("user", this.user))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(TestUtils.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath(RESP_RESULT, is(false)))
            .andExpect(jsonPath(RESP_MSG, is(messageSource.getMessage("label.create.failure.invalid",
                    null,
                    Locale.US))));

        verify(labelServiceMock, never()).addLabel(anyString(), any());
    }

    @Test
    public void getLabels_shouldReturnAllUserLabels() throws Exception {
        //Setup
        String labelName = "Test";
        Label label = new Label();
        List<Label> labelList = new ArrayList<Label>();
        label.setName(labelName);
        labelList.add(label);

        when(labelServiceMock.getAllLabels(this.user.getUsername()))
            .thenReturn(labelList);

        //Perform
        mockMvc.perform((get(LABEL_INDEX_PATH)
                .contentType(TestUtils.APPLICATION_JSON_UTF8)
                .sessionAttr("user", this.user))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(TestUtils.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath(RESP_RESULT, is(true)))
            .andExpect(jsonPath(RESP_MSG, is(messageSource.getMessage("label.index.success",
                    null,
                    Locale.US))))
            .andExpect(jsonPath("$.labels[*]", hasSize(labelList.size())))
            .andExpect(jsonPath("$.labels[0].name", is(labelName)));

        //Assert
        ArgumentCaptor<String> usernameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(labelServiceMock, times(1)).getAllLabels(usernameArgumentCaptor.capture());
        verifyNoMoreInteractions(labelServiceMock);

        String formUsername = usernameArgumentCaptor.getValue();
        assert(formUsername.equals(this.user.getUsername()));
    }
}
