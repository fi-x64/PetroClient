import React, { useState } from 'react'
import { useMap } from 'react-leaflet'
import { SearchOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind'
import styles from './AddPane.module.scss'
import {
  Button,
  Input,
  Form,
  Image,
  Drawer,
  InputNumber,
  DatePicker,
  Tooltip,
  Select,
  Upload,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

const cl = classNames.bind(styles)

function AddPane({ active, onClose }) {
  dayjs.extend(customParseFormat)
  const dateFormat = 'YYYY/MM/DD'
  const { RangePicker } = DatePicker

  var [totalColumn, setTotalColumn] = useState(0);

  var [valuesForm, setValuesForm] = useState("");

  const onChange = (value) => {
    setTotalColumn(value)
  }

  const onFinish = (values) => {
    setValuesForm(values);
    console.log("Check state: ", valuesForm);
  };

  const renderOptions = () => {
    let content = []
    for (let i = 0; i < totalColumn; i++) {
      var labelText = 'Nhập thông tin cột đo thứ ' + (i + 1)
      content.push(
        <li key={i} style={{ marginLeft: '20px' }}>
          <label>{labelText}</label>
          <Form.Item
            label="Chọn loại cột đo"
            name={["columnType", i]}
            rules={[{ required: true, message: 'Vui lòng chọn loại cột đo!' }]}
          >
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={'Số cột đo'}
            type="text"
            name={["fuelNumber", i]}
            rules={[{ min: 1, required: true, message: 'Vui lòng nhập số cột đo!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={'Số tem kiểm định'}
            type="text"
            name={["checkNumber", i]}
            rules={[{ min: 1, required: true, message: 'Vui lòng nhập số tem kiểm định!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={'Ngày kiểm định/Hạn kiểm định'}
            name={["columnDate", i]}
            rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm định, hạn kiểm định!' }]}
          >
            <RangePicker
              // defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
              placeholder={['Ngày kiểm định', 'Hạn kiểm định']}
              format={dateFormat}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </li>
      )
    }
    return content
  }

  // const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
  //   initialValues: {
  //     name: "",
  //     companyName: "",
  //     address: "",
  //     longitude: "",
  //     latitude: "",
  //     numColumn: "",
  //     fuelNumber: "",
  //     checkNumber: "",
  //     columnType: "",
  //     inspectionDate: "",
  //     termDate: "",
  //   },
  //   validationSchema: basicSchema,
  //   onSubmit
  // });

  return (
    <Drawer
      title="Thêm cửa hàng mới"
      placement="left"
      onClose={onClose}
      open={active}
      mask={false}
    >
      <Form onFinish={onFinish} name="basic" layout="vertical" autoComplete="off">
        <Form.Item
          id="name"
          type="text"
          name="name"
          label="Tên cửa hàng"
          rules={[{ required: true, min: 4, max: 100, message: 'Vui lòng nhập tên cửa hàng!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chọn doanh nghiệp"
          name="companyName">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          id="address"
          type="text"
          rules={[{ required: true, min: 4, max: 100, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input />
        </Form.Item>

        <div className={cl('latlng')}>
          <Form.Item
            label="Kinh độ"
            name="longitude"
            id="longitude"
            type="number"
            rules={[{ type: 'number', min: -180, max: 180, required: true, message: 'Vui lòng nhập kinh độ' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Vĩ độ"
            name="latitude"
            id="latitude"
            type="number"
            rules={[{ type: 'number', min: -90, max: 90, required: true, message: 'Vui lòng nhập vĩ độ' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Tooltip title="Go to position">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
          </Tooltip>
        </div>

        <Form.Item
          label="Thêm hình ảnh"
          valuePropName="fileList"
          name="storeImages"
        // rules={[{ required: true, message: 'Vui lòng thêm hình ảnh' }]}
        >
          <Upload
            // action="/upload.do"
            listType="picture-card"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Số lượng cột đo"
          name="numColumn"
          id="numColumn"
          type="number"
          rules={[
            { type: 'number', min: 1, required: true, message: 'Vui lòng nhập số lượng cột đo!' },
          ]}
        >
          <InputNumber
            onChange={onChange}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <ul>{renderOptions()}</ul>

        <Form.Item
          wrapperCol={{ offset: 8, span: 16 }}
          style={{ width: '100%', marginTop: '20px' }}
        >
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddPane
