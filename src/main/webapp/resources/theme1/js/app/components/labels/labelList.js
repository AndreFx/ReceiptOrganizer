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
        this.props.fetchLabels().catch(function(error) {
            console.error('Caught fetch labels error: ' + error);
        });
    }

    render () {
        const { labels, deleteLabel, editLabel, csrfToken, csrfHeaderName, openDialog, closeDialog } = this.props;

        return (
            <List>
                {
                    labels.map((l, ind) => 
                        <Label 
                            key={ind} 
                            name={l.name} 
                            num={ind} 
                            csrfHeaderName={csrfHeaderName}
                            csrfToken={csrfToken}
                            deleteLabel={deleteLabel}
                            editLabel={editLabel}
                            openDialog={openDialog}
                            closeDialog={closeDialog}
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
    editLabel: PropTypes.func.isRequired
};

export default LabelList;