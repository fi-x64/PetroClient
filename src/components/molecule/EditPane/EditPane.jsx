import React, { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import turf from '@turf/boolean-point-in-polygon'
import L from 'leaflet'
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip,
  DatePicker,
  message,
} from 'antd'
import { ErrorMessage, FastField, Field, FieldArray, Formik } from 'formik'

import classNames from 'classnames/bind'
import styles from './EditPane.module.scss'
import {
  DeleteOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useMap } from 'react-leaflet'
import dayjs from 'dayjs'
import ActionButton from '../../atom/ActionButton'
import { getFuelTypes } from '../../../services/type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import RequiredIcon from '../../atom/RequiredIcon/RequiredIcon'
import {
  addStation,
  deleteImage,
  getStationById,
  updateStation,
} from '../../../services/station'
import Dragger from 'antd/es/upload/Dragger'
import axios from 'axios'
import { getAllAreas } from '../../../services/area'
import isMarkerInsidePolygon from '../../../utils/isMarkerInsidePolygon'

const cl = classNames.bind(styles)
const { RangePicker } = DatePicker

const StationSchema = Yup.object().shape({
  name: Yup.string().min(4).max(100).required('Please enter station name!'),
  areaId: Yup.string(),
  address: Yup.string().required('Please enter address!'),
  taxNumber: Yup.string().required('Please enter tax number!'),
  certNumber: Yup.string().required('Please enter cert number!'),
  longitude: Yup.number()
    .min(-180)
    .max(180)
    .required('Longitude value should between -180 and 180!'),
  latitude: Yup.number()
    .min(-90)
    .max(90)
    .required('Latitude value should between -90 and 90!'),
  fuelColumns: Yup.array().of(
    Yup.object().shape({
      fuelNumber: Yup.string().required(
        'Please enter this fuel column number!'
      ),
      checkNumber: Yup.string().required(
        'Please enter this fuel column check number!'
      ),
      inspectionDate: Yup.date()
        .typeError('Please choose inspection date!')
        .required('Please choose inspection date!'),
      columnType: Yup.string().required('Please choose or add column type!'),
      termDate: Yup.date()
        .typeError('Please choose term date!')
        .required('Please choose term date!'),
    })
  ),
})

const sampleColumn = {
  fuelNumber: '',
  checkNumber: '',
  inspectionDate: null,
  columnType: '',
  termDate: null,
}

function EditPane({
  active,
  onClose,
  onGoToPosition,
  animateRef,
  temporaryMarker,
  setTemporaryMarker,
  stationId,
}) {
  const queryClient = useQueryClient()
  const formikRef = useRef()
  const map = useMap()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (formikRef.current && temporaryMarker !== null) {
      formikRef.current.setFieldValue('latitude', temporaryMarker[0] || 0)
      formikRef.current.setFieldValue('longitude', temporaryMarker[1] || 0)

      let insideSomeArea = false
      for (let area of areaQuery.data || []) {
        if (turf([temporaryMarker[1], temporaryMarker[0]], area.geojson)) {
          formikRef.current.setFieldValue('areaId', area._id)
          insideSomeArea = true
          break
        }
      }
      if (!insideSomeArea) {
        formikRef.current.setFieldValue('areaId', '')
      }
    }
  }, [temporaryMarker])

  const fuelTypeQuery = useQuery(['fuel-types'], getFuelTypes)
  const staionQuery = useQuery(
    ['station', stationId],
    () => getStationById({ stationId }),
    {
      enabled: stationId !== undefined,
    }
  )
  const areaQuery = useQuery(['areas'], getAllAreas)

  const deleteImageMutation = useMutation(deleteImage, {
    onSuccess: async (res) => {
      if (res.data.success) message.success(res.data.message)
      await queryClient.refetchQueries(['station'])
    },
  })

  const handleDeleteImage = async ({ imagePublicId, stationId }) => {
    deleteImageMutation.mutate({ stationId, imagePublicId })
  }

  const handleSubmit = async (values, setFieldError) => {
    let operation = addStation
    if (values?._id) operation = updateStation
    let submitValues = JSON.parse(JSON.stringify(values))
    submitValues.images = [...values.images]
    setLoading(true)
    const key = 'uploadable'
    message.loading({
      content: 'Uploading your images. Please do not exit the browser',
      key,
    })
    if (values.imageFiles) {
      for (let image of values.imageFiles) {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'petro_stations')
        const uploadRes = await axios.post(
          'https://api.cloudinary.com/v1_1/dantocthang/image/upload',
          data,
          { withCredentials: false }
        )
        const { url, public_id } = uploadRes.data
        submitValues.images.push({ url, public_id })
      }
    }

    const res = await operation(submitValues)
    if (res.data.success) {
      message.success(res.data.message)
      queryClient.invalidateQueries()
    } else {
      res.data.errors.forEach((err) => setFieldError(err.param, err.msg))
    }
    setLoading(false)
    message.success({
      content: 'Upload completed',
      key,
      duration: 1,
    })
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
        innerRef={formikRef}
        initialValues={
          staionQuery?.data || {
            name: '',
            company: { name: '' },
            address: '',
            taxNumber: '',
            certNumber: '',
            longitude: 0,
            latitude: 0,
            fuelColumns: [sampleColumn],
            images: [],
            imageFiles: [],
            areaId: null,
          }
        }
        onSubmit={(values, { setFieldError }) =>
          handleSubmit(values, setFieldError)
        }
        validationSchema={StationSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form className={cl('form')}>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="name">
                Station name: <RequiredIcon />
              </label>
              <Field
                name="name"
                id="name"
                component={Input}
                value={values.name}
                status={errors?.name && touched?.name ? 'error' : ''}
                className={cl('input')}
                onChange={handleChange}
                onBlur={handleBlur}
              ></Field>
              <ErrorMessage
                className="field-error"
                component="div"
                name="name"
              ></ErrorMessage>
            </div>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="company.name">
                Company name:
              </label>
              <FastField
                name="company.name"
                id="company.name"
                component={Input}
                value={values.company.name}
                status={
                  errors?.company?.name && touched?.company?.name ? 'error' : ''
                }
                className={cl('input')}
                onChange={handleChange}
                onBlur={handleBlur}
              ></FastField>
            </div>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="address">
                Area:
              </label>
              <FastField
                name="areaId"
                id="areaId"
                component={Input}
                disabled={true}
                value={
                  areaQuery?.data?.find((x) => x._id === values.areaId)?.name ||
                  ''
                }
                status={errors?.areaId && touched?.areaId ? 'error' : ''}
                className={cl('input')}
                onChange={handleChange}
                onBlur={handleBlur}
              ></FastField>
            </div>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="address">
                Address: <RequiredIcon />
              </label>
              <FastField
                name="address"
                id="address"
                component={Input.TextArea}
                maxLength={200}
                showCount
                value={values.address}
                status={errors?.address && touched?.address ? 'error' : ''}
                className={cl('input')}
                onChange={handleChange}
                onBlur={handleBlur}
              ></FastField>
              <ErrorMessage
                className="field-error"
                component="div"
                name="address"
              ></ErrorMessage>
            </div>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="taxNumber">
                Tax number: <RequiredIcon />
              </label>
              <FastField
                name="taxNumber"
                id="taxNumber"
                component={Input}
                value={values.taxNumber}
                status={errors?.taxNumber && touched?.taxNumber ? 'error' : ''}
                className={cl('input')}
                onChange={handleChange}
                onBlur={handleBlur}
              ></FastField>
              <ErrorMessage
                className="field-error"
                component="div"
                name="taxNumber"
              ></ErrorMessage>
            </div>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="taxNumber">
                Cert number: <RequiredIcon />
              </label>
              <FastField
                name="certNumber"
                id="certNumber"
                component={Input}
                value={values.certNumber}
                status={
                  errors?.certNumber && touched?.certNumber ? 'error' : ''
                }
                className={cl('input')}
                onChange={handleChange}
                onBlur={handleBlur}
              ></FastField>
              <ErrorMessage
                className="field-error"
                component="div"
                name="certNumber"
              ></ErrorMessage>
            </div>
            <div className={cl('group')}>
              <label className={cl('label')} htmlFor="imageFiles">
                Images:
              </label>
              <Dragger
                accept="image/*"
                name="imageFiles"
                multiple={true}
                fileList={values.imageFiles}
                beforeUpload={async (file, fileList) => {
                  setFieldValue('imageFiles', fileList)
                  return false
                }}
                onRemove={(file) =>
                  setFieldValue(
                    'imageFiles',
                    values.imageFiles.filter((x) => x.uid !== file.uid)
                  )
                }
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Dragger>
              <div className={cl('image-list')}>
                {values.images.map((x) => (
                  <div key={x?._id || x.uid} className={cl('image')}>
                    <img
                      className={cl('img')}
                      src={x?._id ? x.url : URL.createObjectURL(x)}
                      alt=""
                    />
                    <ActionButton
                      className={cl('image-delete')}
                      onClick={() => {
                        setFieldValue(
                          'images',
                          values.images.filter(
                            (x) => x.imagePublicId !== x.public_id
                          )
                        )
                        handleDeleteImage({
                          // values,
                          // setFieldValue,
                          // uid: x?.uid,
                          imagePublicId: x.public_id,
                          stationId: stationId,
                        })
                      }}
                      icon={<DeleteOutlined />}
                      tooltipText="Delete this image?"
                      type="delete"
                    ></ActionButton>
                  </div>
                ))}
              </div>
            </div>
            <div className={cl('row')}>
              <div className={cl('row-group')}>
                <label className={cl('label')} htmlFor="longitude">
                  Longitude: <RequiredIcon />
                </label>
                <FastField
                  name="longitude"
                  id="longitude"
                  component={InputNumber}
                  value={values.longitude}
                  status={
                    errors?.longitude && touched?.longitude ? 'error' : ''
                  }
                  className={cl('input')}
                  onChange={(value) => setFieldValue('longitude', value)}
                  onBlur={handleBlur}
                ></FastField>
                <ErrorMessage
                  className="field-error"
                  component="div"
                  name="longitude"
                ></ErrorMessage>
              </div>
              <div className={cl('row-group')}>
                <label className={cl('label')} htmlFor="latitude">
                  Latitude: <RequiredIcon />
                </label>
                <FastField
                  name="latitude"
                  id="latitude"
                  component={InputNumber}
                  value={values.latitude}
                  status={errors?.latitude && touched?.latitude ? 'error' : ''}
                  className={cl('input')}
                  onChange={(value) => setFieldValue('latitude', value)}
                  onBlur={handleBlur}
                ></FastField>
                <ErrorMessage
                  className="field-error"
                  component="div"
                  name="latitude"
                ></ErrorMessage>
              </div>
              <Tooltip title="Go to position">
                <Button
                  onClick={() => {
                    onGoToPosition([values.latitude, values.longitude])
                    map.setView([values.latitude, values.longitude], 10, {
                      animate: animateRef.current || false,
                    })
                    map.panTo([values.latitude, values.longitude])
                  }}
                  className={cl('go-button')}
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>
              <Tooltip title="Mark position by hand. Drag the marker to the chosen location.">
                <Button
                  onClick={(e) => {
                    const currentCenterLatlng = map.getCenter()
                    setTemporaryMarker([
                      currentCenterLatlng.lat,
                      currentCenterLatlng.lng,
                    ])
                  }}
                  className={cl('go-button')}
                  type="primary"
                  shape="circle"
                  icon={<EnvironmentOutlined />}
                />
              </Tooltip>
            </div>
            <FieldArray name="fuelColumns">
              {(fuelArrayHelper) => (
                <>
                  <div className={cl('list')}>
                    {values.fuelColumns.map((column, index) => (
                      <div key={index} className={cl('fuel')}>
                        <div className={cl('fuel-action')}>
                          <div className={cl('number')}>
                            Fuel column #{index + 1}
                          </div>
                          <ActionButton
                            onClick={() => fuelArrayHelper.remove(index)}
                            type="delete"
                            icon={<DeleteOutlined />}
                            tooltipText="Delete this fuel column"
                          ></ActionButton>
                        </div>
                        <div className={cl('group')}>
                          <label
                            className={cl('label')}
                            htmlFor={`fuelColumns[${index}].fuelNumber`}
                          >
                            Fuel column number: <RequiredIcon />
                          </label>
                          <Field
                            name={`fuelColumns[${index}].fuelNumber`}
                            id={`fuelColumns[${index}].fuelNumber`}
                            component={Input}
                            value={values.fuelColumns[index].fuelNumber}
                            status={
                              errors?.fuelColumns?.[index]?.fuelNumber &&
                              touched?.fuelColumns?.[index]?.fuelNumber
                                ? 'error'
                                : ''
                            }
                            className={cl('input')}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></Field>
                          <ErrorMessage
                            className="field-error"
                            component="div"
                            name={`fuelColumns[${index}].fuelNumber`}
                          ></ErrorMessage>
                        </div>
                        <div className={cl('group')}>
                          <label
                            className={cl('label')}
                            htmlFor={`fuelColumns[${index}].checkNumber`}
                          >
                            Fuel check number: <RequiredIcon />
                          </label>
                          <Field
                            name={`fuelColumns[${index}].checkNumber`}
                            id={`fuelColumns[${index}].checkNumber`}
                            component={Input}
                            value={values.fuelColumns[index].checkNumber}
                            status={
                              errors?.fuelColumns?.[index]?.checkNumber &&
                              touched?.fuelColumns?.[index]?.checkNumber
                                ? 'error'
                                : ''
                            }
                            className={cl('input')}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></Field>
                          <ErrorMessage
                            className="field-error"
                            component="div"
                            name={`fuelColumns[${index}].checkNumber`}
                          ></ErrorMessage>
                        </div>
                        <div className={cl('group')}>
                          <label
                            className={cl('label')}
                            htmlFor={`fuelColumns[${index}].columnType`}
                          >
                            Term date and Inspection date: <RequiredIcon />
                          </label>
                          <RangePicker
                            defaultValue={[dayjs(), dayjs()]}
                            value={[
                              values.fuelColumns[index].termDate === null
                                ? null
                                : dayjs(values.fuelColumns[index].termDate),
                              values.fuelColumns[index].inspectionDate === null
                                ? null
                                : dayjs(
                                    values.fuelColumns[index].inspectionDate
                                  ),
                            ]}
                            status={
                              (errors?.fuelColumns?.[index]?.termDate &&
                                touched?.fuelColumns?.[index]?.termDate) ||
                              (errors?.fuelColumns?.[index]?.inspectionDate &&
                                touched?.fuelColumns?.[index]?.inspectionDate)
                                ? 'error'
                                : ''
                            }
                            onCalendarChange={(dates, dateStrings) => {
                              setFieldValue(
                                `fuelColumns[${index}].termDate`,
                                dates[0]
                              )
                              setFieldValue(
                                `fuelColumns[${index}].inspectionDate`,
                                dates[1]
                              )
                            }}
                          />
                          <ErrorMessage
                            className="field-error"
                            component="div"
                            name={`fuelColumns[${index}].termDate`}
                          ></ErrorMessage>
                          <ErrorMessage
                            className="field-error"
                            component="div"
                            name={`fuelColumns[${index}].inspectionDate`}
                          ></ErrorMessage>
                        </div>
                        <div className={cl('group')}>
                          <label
                            className={cl('label')}
                            htmlFor={`fuelColumns[${index}].columnType`}
                          >
                            Fuel column type: <RequiredIcon />
                          </label>
                          <Select
                            style={{ width: '100%' }}
                            name={`fuelColumns[${index}].columnType`}
                            id={`fuelColumns[${index}].columnType`}
                            value={values.fuelColumns[index].columnType}
                            status={
                              errors?.fuelColumns?.[index]?.columnType &&
                              touched?.fuelColumns?.[index]?.columnType
                                ? 'error'
                                : ''
                            }
                            className={cl('select')}
                            onChange={(value) =>
                              setFieldValue(
                                `fuelColumns[${index}].columnType`,
                                value
                              )
                            }
                            onBlur={handleBlur}
                            showSearch
                            placeholder="Select fuel column type"
                            optionFilterProp="children"
                            onSearch={(value) => console.log(value)}
                            filterOption={(input, option) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            loading={
                              fuelTypeQuery.isLoading || fuelTypeQuery.isError
                            }
                            options={fuelTypeQuery?.data?.map((x) => ({
                              value: x.name,
                              label: x.name,
                            }))}
                          ></Select>
                          <ErrorMessage
                            className="field-error"
                            component="div"
                            name={`fuelColumns[${index}].columnType`}
                          ></ErrorMessage>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={cl('add')}
                    onClick={() => fuelArrayHelper.push(sampleColumn)}
                  >
                    Add column
                  </Button>
                </>
              )}
            </FieldArray>
            <div className={cl('footer')}>
              <Button
                loading={loading}
                type="primary"
                onClick={handleSubmit}
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  )
}

export default EditPane
