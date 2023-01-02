import React, { useState } from 'react'
import { useMap } from 'react-leaflet'
import { SearchOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind'
import styles from './AddPane.module.scss'
import {
  Button,
  Form,
  Drawer,
  Tooltip,
} from 'antd'
import { ErrorMessage, Field, Formik } from 'formik'
import { basicSchema } from '../../../schemas'
import InputField from '../../custom-fields/InputField'
import SelectField from '../../custom-fields/SelectField'
import UploadField from '../../custom-fields/UploadField'
import RangePicker from '../../custom-fields/RangePicker'

const cl = classNames.bind(styles)

function AddPane({ active, onClose }) {
  const initialValues = {
    name: "",
    longitude: "",
    latitude: "",
    companyName: "",
    address: "",

    numColumn: "",

    columns: [
      {
        columnNumber: "",
        columnCheckNumber: "",
        columnType: "",
        columnInspectionDate: "",
        columnTermDate: "",
      }
    ],
  }

  const renderOptions = (numColumns, values) => {
    let content = []
    for (let i = 0; i < numColumns; i++) {
      var labelText = 'Nhập thông tin cột đo thứ ' + (i + 1)
      content.push(
        <li key={i} style={{ marginLeft: '20px' }}>
          <label>{labelText}</label>
          <Field
            name={`columns[${i}].columnType`}
            label="Chọn loại cột đo"
            component={SelectField}
            options={[
              {
                value: 'jack',
                name: 'Jack',
              },
              {
                value: 'lucy',
                name: 'Lucy',
              },
              {
                value: 'Yiminghe',
                name: 'yiminghe',
              },
            ]}
            onChangeFromParent={(value) => {
              value ? values.columns[i].columnType = value : "";
            }}
          >
          </Field>
          <Field
            name={`columns[${i}].columnNumber`}
            label={'Mã số cột đo'}
            component={InputField}
          >
          </Field>
          <Field
            name={`columns[${i}].columnCheckNumber`}
            label={'Số tem kiểm định'}
            component={InputField}
          >
          </Field>

          <Field
            name={`columns[${i}].columnDate`}
            label={'Ngày kiểm định / Hạn kiểm định'}
            component={RangePicker}
            onChangeFromParent={(value) => {
              if (value) {
                values.columns[i].columnInspectionDate = value[0];
                values.columns[i].columnTermDate = value[1];
              }
            }}
          >
          </Field>
        </li>
      )
    }
    return content
  }

  return (
    <Drawer
      title="Thêm cửa hàng mới"
      placement="left"
      onClose={onClose}
      open={active}
      mask={false}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={basicSchema}
      >
        {formikProps => {
          const { values, errors, touched } = formikProps;

          const onFinish = () => {
            console.log("Submitted: ", values);
          };

          console.log({ values, errors, touched });

          return (
            <Form onFinish={formikProps.handleSubmit} name="basic" layout="vertical" autoComplete="off">
              <Field
                name="name"
                component={InputField}

                label="Tên cửa hàng"
                placeholder="Cây xăng Châu Thành..."
              />
              <Field
                name="companyName"
                component={SelectField}

                label="Chọn doanh nghiệp"
                placeholder="Doanh nghiệp..."
                onChangeFromParent={(value) => {
                  value ? values.companyName = value : "";
                }}
                options={[
                  {
                    value: 'jack',
                    name: 'Jack',
                  },
                  {
                    value: 'lucy',
                    name: 'Lucy',
                  },
                  {
                    value: 'Yiminghe',
                    name: 'yiminghe',
                  },
                ]}
              />
              <Field
                name="address"
                component={InputField}

                label="Địa chỉ"
                placeholder="225, đường Trần Hưng Đạo..."
              />
              <div className={cl('latlng')}>
                <Field
                  name="longitude"
                  component={InputField}

                  label="Kinh độ"
                  type="number"
                  min={-180}
                  max={180}
                />
                <Field
                  name="latitude"
                  component={InputField}

                  label="Vĩ độ"
                  type="number"
                  min={-90}
                  max={90}
                />
                <Tooltip title="Go to position">
                  <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                </Tooltip>
              </div>
              <Field
                name="taxNumber"
                component={InputField}

                label="Mã số thuế"
              />
              <Field
                name="certNumber"
                component={InputField}

                label="Số giấy chứng nhận đủ điều kiện"
              />
              <Field
                name="storeImages"
                component={UploadField}

                label="Ảnh cửa hàng"
              />
              <Field
                label="Số lượng cột đo"
                name="numColumn"
                component={InputField}

                min={1}
                type="number"
              >
              </Field>

              <ul name="columns">{renderOptions(values.numColumn, values)}</ul>

              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                style={{ width: '100%', marginTop: '20px' }}
              >
                <Button type="primary" htmlType="submit">
                  Lưu thông tin
                </Button>
              </Form.Item>
            </Form>
          );
        }}

      </Formik>
    </Drawer>
  )
}

export default AddPane
