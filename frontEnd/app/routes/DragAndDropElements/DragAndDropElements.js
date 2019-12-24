import React from 'react';

import {
    Container,
    Button
} from './../../components';
import {
    HeaderMain
} from './components/headerMain';

import {
    MultipleVerticalLists,
} from './components';

export class DragAndDropElements extends React.Component {
    multipleVerticalListsRef = React.createRef();
    draggableTableRef = React.createRef();
    horizontalLists = React.createRef();

    onResetState = () => {
        this.multipleVerticalListsRef.current.saveOrder();
    }

    render() {
        return (
            <Container>
                <div className="d-flex">
                    <div>
                        <HeaderMain title="Exclusion List" 
                            className="mb-5 mt-4"
                        />
                    </div>
                    {/* <Button onClick={ this.onResetState } className="ml-auto align-self-center" color="primary" outline>
                        Save Order
                    </Button> */}
                </div>

                <div className="mb-5">
                    <MultipleVerticalLists ref={ this.multipleVerticalListsRef }/>
                </div>

            </Container>
        );
    }
}
