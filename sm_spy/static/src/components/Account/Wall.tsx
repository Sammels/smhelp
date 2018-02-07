import * as React from "react";

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import '../../typing'


export default class Wall extends React.Component<IWallProps, IWallState> {

    props: IWallProps

    constructor(props) {
        super(props);
    }

    render () {

        const group_data = this.props.groupWall.map((object, index) => {
            return {
                'vk_id': object.vk_id,
                'text': (object.text.length > 100) ? object.text.substr(0, 100) + '...' : object.text,
                'comments': object.comments,
                'likes': object.likes,
                'views': object.views,
                'reposts': object.reposts,
                'date': object.dt_create,
            }
        });
        const content = (
            <BootstrapTable data={group_data} striped={true} hover={true}>
              <TableHeaderColumn dataField="vk_id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="date" dataAlign="center" dataSort={false}>Дата</TableHeaderColumn>
              <TableHeaderColumn dataField="text" dataAlign="center" dataSort={true}>Текст</TableHeaderColumn>
              <TableHeaderColumn dataField="comments" dataAlign="center" dataSort={true}>Коммент.</TableHeaderColumn>
              <TableHeaderColumn dataField="likes" dataAlign="center" dataSort={true}>Лайки</TableHeaderColumn>
              <TableHeaderColumn dataField="reposts" dataAlign="center" dataSort={true}>Репосты</TableHeaderColumn>
              <TableHeaderColumn dataField="views" dataAlign="center" dataSort={true}>Просм.</TableHeaderColumn>
            </BootstrapTable>);
        return content
    }

}