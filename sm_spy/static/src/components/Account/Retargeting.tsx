import * as React from "react";

import '../../typing'
import {ChangeEvent} from "react";
import { searchGroups } from '../../actions/groupsActions';

export default class Retargeting extends React.Component<IRetargetingProps, IRetargetingState> {

    props: IRetargetingProps

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ""
        }
    }

    onChangeSearch(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            searchValue: e.target.value
        })
    }

    onStartSearch() {
        alert("Запрос отправлен. Ждем результата...");
        this.props.searchGroup(this.state.searchValue);
    }

    render () {


        const content = (<div>
            <label>Введите поисковый запрос, по которому будут собраны участники сообществ</label>
            <input type="text" value={this.state.searchValue} onChange={(e) => this.onChangeSearch(e)}/>
            <button onClick={() => this.onStartSearch() }>Выгрузить</button>
        </div>)

        return content
    }

}

