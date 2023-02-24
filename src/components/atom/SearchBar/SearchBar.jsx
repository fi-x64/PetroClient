import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames/bind'
import { Input, List, Avatar, Select } from 'antd'

const { Search } = Input

import styles from './SearchBar.module.scss'
import { handleSearchAPI } from '../../../services/user'
import { useMap } from 'react-leaflet'

const cl = classNames.bind(styles)

function SearchBar({
    toggleAddPane,
    togglePane,
    setCurrentStation,
    setNewTemporaryMarker,
    showPopUp, areaQuery, handleChangeArea,
}) {
    const map = useMap()
    const [showResult, setShowResult] = useState(false)
    const [data, setData] = useState([])
    const [areaId, setAreaId] = useState(null);
    var selectArea = useRef(null);

    const handleSearch = async (e) => {
        if (e.target.value) {
            let res = await handleSearchAPI({ data: e.target.value, areaId: areaId })
            if (res.length > 0) {
                setShowResult(true)
                setData(res)
            } else {
                setShowResult(false)
                setData([])
            }
        } else {
            setShowResult(false)
            setData([])
        }
    }

    const handleClickResult = (item) => {
        toggleAddPane(false)
        togglePane(true)
        setCurrentStation(item)
        showPopUp(item.longitude, item.latitude)
        setShowResult(false)
        map.panTo([item.latitude, item.longitude])
    }

    const handleChange = (value) => {
        selectArea.current.blur();
        if (value != 'Tất cả') {
            for (let i = 0; i < areaQuery.data.length; i++) {
                if (value === areaQuery.data[i].name) {
                    handleChangeArea(areaQuery.data[i]);
                    setAreaId(areaQuery.data[i]._id);
                    break;
                }
            }
        }
        else {
            handleChangeArea({ name: value });
            setAreaId(null);
        };
    };

    return (
        <div className={cl('wrapper')}>
            <Select
                ref={selectArea}
                showSearch
                defaultValue="Tất cả"
                style={{ width: 200 }}
                onChange={handleChange}
                fieldNames={{ label: 'name', value: 'name' }}
                options={areaQuery.data && [{ name: 'Tất cả' }, ...areaQuery.data]}
            />
            <Search
                className={cl('search-bar')}
                size="middle"
                placeholder="Tìm kiếm cây xăng, tìm theo phường, xã,..."
                onChange={handleSearch}
                style={{ width: 400 }}
                allowClear={true}
                onClick={handleSearch}
            />

            {showResult ? (
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    style={{ backgroundColor: '#fff' }}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="" />}
                                title={
                                    <a
                                        style={{ color: '#3a8ece' }}
                                        onClick={() => {
                                            handleClickResult(item)
                                        }}
                                    >
                                        {item.name}
                                    </a>
                                }
                                description={
                                    <a
                                        style={{ color: '#000' }}
                                        onClick={() => {
                                            handleClickResult(item)
                                        }}
                                    >
                                        {item.address}
                                    </a>
                                }
                            />
                        </List.Item>
                    )}
                />
            )
                : null}
        </div>
    )
}

export default SearchBar
