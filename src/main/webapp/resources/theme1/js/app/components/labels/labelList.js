import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';

//Custom Imports
import Label from './label';

class LabelList extends React.Component {

    constructor (props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchLabels();
    }

    render () {
        const { labels, deleteLabel, editLabel, csrfToken, csrfHeaderName, openDialog, closeDialog, updateActiveLabels, activeLabels, query, currentReceiptPage, drawerOpen } = this.props;

        return (
            <List>
                {
                    labels.map((l, ind) => 
                        <Label 
                            key={l.name} 
                            label={l} 
                            csrfHeaderName={csrfHeaderName}
                            csrfToken={csrfToken}
                            deleteLabel={deleteLabel}
                            editLabel={editLabel}
                            openDialog={openDialog}
                            closeDialog={closeDialog}
                            updateActiveLabels={updateActiveLabels}
                            activeLabels={activeLabels}
                            query={query}
                            currentReceiptPage={currentReceiptPage}
                            drawerOpen={drawerOpen}
                        />
                    )
                }
            </List>
        );
    }
}

LabelList.propTypes = {
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    csrfHeaderName: PropTypes.string.isRequired,
    csrfToken: PropTypes.string.isRequired,
    fetchLabels: PropTypes.func.isRequired,
    deleteLabel: PropTypes.func.isRequired,
    editLabel: PropTypes.func.isRequired,
    updateActiveLabels: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired
};

export default LabelList;