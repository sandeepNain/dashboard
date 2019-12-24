import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';
// import uid from 'uuid/v4';
// import faker from 'faker/locale/en_US';
import classNames from 'classnames';
import {
    Card,
    CardHeader,
    CardTitle,
    Media,
    Avatar,
    AvatarAddOn
} from './../../../components';
import { randomAvatar, randomArray } from './../../../utilities';
import { reorder, move } from './utilities';
import classes from './common.scss';


import {siteURL} from './../../../../constant'

//  Utility Functions
//=========================================================
// const generateItem = () => ({
//     id: uid(),
//     type: 'single',
//     name: `${faker.name.firstName()} ${faker.name.lastName()}`,
//     title: faker.name.jobType(),
//     avatarUrl: randomAvatar(),
//     status: randomArray(['success', 'warning', 'danger'])
// });

const getListClass = (isDraggedOver) =>
    classNames(classes['list'], {
        [classes['list--drag-over']]: isDraggedOver
    });

const getItemClass = (isDragging) =>
    classNames(classes['list-group-item'], {
        [classes['list-group-item--dragging']]: isDragging
    });

const formateDate = (date) => {
    var mydate = new Date(date);
        let day = mydate.getDate();
        let month = mydate.getMonth()+1;
        let year = mydate.getFullYear();
        let hour = mydate.getHours();
        hour = hour < 10 ? '0'+hour : hour;
        let minute = mydate.getMinutes();
        minute = minute < 10 ? '0'+minute : minute;
        let second = mydate.getSeconds();
        second = second < 10 ? '0'+second : second;
        return(day+'/'+month+'/'+year+' '+hour+':'+minute+':'+second);
}

//  Draggable List Component
//=========================================================
const VerticalList = React.memo((props) => {
    
    return (
        <Droppable droppableId={ props.listId }>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={`list-group list-group-flush flex-grow-1 ${getListClass(snapshot.isDraggingOver)}`}
                >                    
                    {props.items.map((item, index) => (
                        <Draggable
                            key={item.job_id}
                            draggableId={`${item.job_id}`}
                            index={index}>
                            {(provided, draggableSnapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`list-group-item ${getItemClass(draggableSnapshot.isDragging)}`}
                                >
                                    <Media>
                                        {/* <Media left className="align-self-center pr-3">
                                            <i className="fa fa-ellipsis-v text-muted" />
                                        </Media> */}
                                        {/* <Media left middle className="mr-4 align-self-center">
                                            <Avatar.Image
                                                size="md"
                                                className="d-block"
                                                src={ item.avatarUrl }
                                                addOns={[
                                                    <AvatarAddOn.Icon 
                                                        className="fa fa-circle"
                                                        color="white"
                                                        key="avatar-icon-bg"
                                                    />,
                                                    <AvatarAddOn.Icon 
                                                        className="fa fa-circle"
                                                        color={ item.status }
                                                        key="avatar-icon-fg"
                                                    />
                                                ]}
                                            /> 
                                        </Media> */}
                                        <Media body>
                                            <span className="mt-0 h6 mb-1">
                                                { item.JobName }
                                            </span>
                                            <p className="mb-0 text-muted text-truncate">
                                                { formateDate(item.LastRunDate) }
                                            </p>
                                        </Media>
                                    </Media>
                                </div>
                            )}
                        </Draggable>
                    ))}
                </div>
            )}
        </Droppable>
    );
});
VerticalList.propTypes = {
    items: PropTypes.array,
    listId: PropTypes.string,
    title: PropTypes.string
}

//  Draggable Column Component
//=========================================================
class Column extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.string,
        index: PropTypes.number,
        title: PropTypes.string
    }

    render() {
        const { children, id, index, title } = this.props;

        return (
            <Draggable
                draggableId={id}
                index={index}
            >
                {(provided) => (
                    <div
                        className="col-md-4"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <Card className="h-100">
                            <CardHeader {...provided.dragHandleProps} className="b-0 bg-#c1c1c1">
                                <CardTitle className="h6 mb-0">
                                    { title }
                                </CardTitle>
                            </CardHeader>
                            { children }
                        </Card>
                    </div>
                )}
            </Draggable>
        )
    }
}

//  Demo Component
//=========================================================
const initialState = {
    unExclusionList: [],
    ExclusionList: [],
    lists: [
        { id: 'unExclusionList', title: 'All Jobs' },
        { id: 'ExclusionList', title: 'Excluded Jobs' },
    ]
};
export class MultipleVerticalLists extends React.Component {
    static propTypes = {
        className: PropTypes.string
    }

    state = _.clone(initialState);

    constructor (props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    fetchJobs = (path) => {
        this.setState({
            unExclusionList: [],
            ExclusionList: [],
            loaderVisibility: true,
        });
        fetch(siteURL + 'exclusionList', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({
          // })
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              this.setState({
                unExclusionList: [],
                ExclusionList: [],
                loaderVisibility: false,
              });
              // toast("Error in Getting Failed Jobs !");
            } else {
              this.setState({
                unExclusionList: data.result,
                ExclusionList: data.exclusionList,
                loaderVisibility: false,
              });
            }
          })
          .catch(error => {
            console.log("error in getting data form db");
            this.setState({
                unExclusionList: [],
                ExclusionList: [],
              loaderVisibility: false,
            });
            // toast("Error in Getting Failed Jobs !");
          }
          );
      }
  
    componentDidMount() {
        this.fetchJobs();
    }

    onDragEnd(result) {
        const { source, destination } = result;

        // Swap column positions
        if (source.droppableId === 'board') {
            if (destination.droppableId !== 'board') {
                return;
            }
            const lists = reorder(
                this.state.lists,
                source.index,
                destination.index
            );

            this.setState({ lists });
            return;
        }

        // dropped outside the list
        if (!destination) {
            return;
        }

        // Handle List Items
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.state[`${source.droppableId}`],
                source.index,
                destination.index
            );

            this.setState({
                [`${source.droppableId}`]: items
            });
        } else {
            // change and save list in db
            if(`${destination.droppableId}` == 'ExclusionList')
            {
                //add to the exclusion list
                var obj = this.state[`${source.droppableId}`][source.index];
                fetch(siteURL + 'addOneInList', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      "addObj": obj,
                    })
                  })
                    .then(response => response.json())
                    .then(data => {
                      if (data.error) {
                        toast("Error in saving list !");
                      } else {
                      }
                    })
                    .catch(error => {
                      console.log("error in getting data form db");
                      toast("Error in saving lsit !");
                    }
                    );
            } else {
                // remove to the exclusion list
                var obj = this.state[`${source.droppableId}`][source.index];
                fetch(siteURL + 'removeOneToList', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "removeObj": obj,
                    })
                  })
                    .then(response => response.json())
                    .then(data => {
                      if (data.error) {
                        toast("Error in saving list !");
                      } else {
                      }
                    })
                    .catch(error => {
                      console.log("error in getting data form db");
                      toast("Error in saving lsit !");
                    }
                    );
            }
            // list save function end

            const result = move(
                this.state[`${source.droppableId}`],
                this.state[`${destination.droppableId}`],
                source,
                destination
            );

            this.setState(_.mapKeys(result, (val, key) => `${key}`));
        }
    }

    saveOrder() {
            fetch(siteURL + 'addToExclusion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                "exclusionList": this.state.ExclusionList,
                "unExclusionList": this.state.unExclusionList,
              })
            })
              .then(response => response.json())
              .then(data => {
                if (data.error) {
                  toast("Error in saving list !");
                } else {
                    toast("List saved sucessfully !");
                }
              })
              .catch(error => {
                console.log("error in getting data form db");
                toast("Error in saving lsit !");
              }
              );
    }

    render() {
        const { className } = this.props;
        const { lists } = this.state;

        return (
            <div className={ className }>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable
                        droppableId="board"
                        type="COLUMN"
                        direction="horizontal"
                    >
                        {(provided) => (
                            <div
                                className="row"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {_.map(lists, (list, index) => (
                                    <Column
                                        id={list.id}
                                        index={ index }
                                        title={list.title}
                                        key={ list.id }
                                    >
                                        <VerticalList
                                            listId={list.id}
                                            items={this.state[`${list.id}`]}
                                        />
                                    </Column>
                                ))}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <ToastContainer 
                    position={'top-right'}
                    autoClose={5000}
                    draggable={false}
                    hideProgressBar={true}
                />
            </div>
        )
    }
}