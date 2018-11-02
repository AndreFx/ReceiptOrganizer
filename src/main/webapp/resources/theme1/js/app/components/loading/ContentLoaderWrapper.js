import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

class ContentLoaderWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { height, width, speed, visible, svgElements } = this.props;

        return (
            <div>
                {
                    visible &&
                    <ContentLoader
                        height={height}
                        width={width}
                        speed={speed}
                        primaryColor="#f3f3f3"
                        secondaryColor="#ecebeb"
                    >
                        {
                            svgElements
                        }
                    </ContentLoader>
                }
            </div>
        );
    }
}

ContentLoaderWrapper.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    svgElements: PropTypes.array.isRequired
}

export default ContentLoaderWrapper;