import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import { createShallow, createMount } from "@material-ui/core/test-utils";
import Adapter from "enzyme-adapter-react-16";
import SnackbarContentWrapper from "../../../../app/components/snackbar/SnackbarContentWrapper";
import * as constants from "../../../../common/constants";

Enzyme.configure({ adapter: new Adapter() });

describe("SnackbarContentWrapper", function() {
  let muiShallow;
  let muiMount;

  beforeAll(function() {
    muiShallow = createShallow(shallow);
    muiMount = createMount(mount);
  });

  it("should render self and subcomponents", function() {
    const props = {
      message: "Added category!",
      onClose: jest.fn(),
      variant: constants.SUCCESS_SNACKBAR,
      actions: [],
      handlers: [],
      handlerParams: []
    };
    const enzymeWrapper = muiMount(<SnackbarContentWrapper {...props} />);

    expect(enzymeWrapper.find("SnackbarContent").length).toBe(1);

    const snackbarContentProps = enzymeWrapper.find("SnackbarContent").props();

    //Should only have close action
    expect(snackbarContentProps.action.length).toBe(1);
    expect(enzymeWrapper.find("span#client-snackbar").text()).toEqual(
      props.message
    );
  });
});
