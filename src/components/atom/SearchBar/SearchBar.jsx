import React, { useState } from 'react'

import classNames from 'classnames/bind';
import { Input, List, Avatar } from 'antd';

const { Search } = Input;

import styles from './SearchBar.module.scss';
import { handleSearchAPI } from '../../../services/user';
const cl = classNames.bind(styles);

const onSearch = (value) => console.log(value);

function SearchBar() {
    const [showResult, setShowResult] = useState(false);
    const [data, setData] = useState([]);

    const handleSearch = async (e) => {
        let res = await handleSearchAPI({ data: e.target.value });
        if (res.length > 0) {
            setShowResult(true);
            setData(res);
        } else {
            setShowResult(false)
            setData([])
        };
    }

    return (
        <div className={cl('wrapper')}>
            <Search className={cl('search-bar')} size='middle'
                placeholder="Tìm kiếm cây xăng, tìm theo phường, xã,..."
                onSearch={onSearch}
                onChange={handleSearch}
                style={{ width: 400 }}
                allowClear={true}
            />
            {showResult ?
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    style={{ backgroundColor: '#fff' }}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="" />}
                                title={item.name}
                                description={item.address}
                            />
                        </List.Item>
                    )}
                /> : null}

        </div>
    )
}

export default SearchBar
