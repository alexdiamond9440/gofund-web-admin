import { CInputGroupText, CInputGroup } from '@coreui/react';
import React, { Component } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import { backendUrl } from '../../Config';

const PaymentDetailModal = (props) => {
    const {
      isLoading,
      open,
      selectedDonationsDetail,
      transactionId,
      amount,
      errors,
      note,
      paymentMode,
      handleInputChange,
      updatePayoutStatus,
      toggle,
    } = props;

    const { fundRaiserInfo = {} } = selectedDonationsDetail || {};

    return (
      <Modal
        size='lg'
        isOpen={open}
        toggle={toggle}
        className={`form-input user-form paypal-form-details`}
      >
        <ModalHeader className='title-with-close'>
          Transfer fund to{' '}
          {fundRaiserInfo
            ? [fundRaiserInfo.first_name, fundRaiserInfo.last_name].join(' ')
            : null}
          <i onClick={toggle} className='icon-close cursor-pointer'></i>
        </ModalHeader>
        <Form onSubmit={updatePayoutStatus}>
          <ModalBody>
            {fundRaiserInfo && fundRaiserInfo.Donation ? (
              <div className='paypal-detail-wrap'>
                <div className='paypal-detail-block'>
                  <span className='paypal-amount-heading'>Paypal Email:</span>{' '}
                  <span className='link-tile'>
                    {fundRaiserInfo.Donation.paypal_email || '-'}
                  </span>
                </div>
                <div className='paypal-detail-block'>
                  <span className='paypal-amount-heading'>
                    Paypal Mobile Number:
                  </span>{' '}
                  <span className='link-tile'>
                    {fundRaiserInfo.Donation.paypal_mobile || '-'}
                  </span>
                </div>
                <div className='paypal-detail-block'>
                  <span className='paypal-amount-heading'>Account number:</span>{' '}
                  <span className='link-tile'>
                    {fundRaiserInfo.Donation.account_number || '-'}
                  </span>
                </div>
                <div className='paypal-detail-block'>
                  <span className='paypal-amount-heading'>Routing number:</span>{' '}
                  <span className='link-tile'>
                    {fundRaiserInfo.Donation.routing_number || '-'}
                  </span>
                </div>
                <div className='paypal-detail-block'>
                  <span className='paypal-amount-heading'>User country:</span>{' '}
                  <span className='link-tile'>
                    {fundRaiserInfo.Donation.paypal_country || '-'}
                  </span>
                </div>
                <div className='paypal-detail-block'>
                  <span className='paypal-amount-heading'>User Photo ID:</span>{' '}
                  <span className='link-tile'>
                    {fundRaiserInfo.Donation.paypal_photo_id && (
                      <div className='img-section'>
                        <img
                          className='setimage'
                          src={`${backendUrl}${fundRaiserInfo.Donation.paypal_photo_id}`}
                          alt={''}
                          style={{
                            minWidth: '100%',
                            width: '100%',
                            height: '250px',
                          }}
                        />
                      </div>
                    )}
                    {!fundRaiserInfo.Donation.paypal_photo_id && 'N/A'}
                  </span>
                </div>
              </div>
            ) : null}
            <Row className='row mt-3'>
              <Col sm='6'>
                <FormGroup>
                  <Label className='floating-label'>
                    Paid via<span className='mandatory'> *</span>
                  </Label>
                  <Input
                    type='select'
                    id='exampleSelect'
                    name='paymentMode'
                    value={paymentMode}
                    onChange={handleInputChange}
                  >
                    <option value='paypal'>Paypal</option>
                    <option value='stripe'>Stripe</option>
                    <option value='mobileNumber'>Mobile Number</option>
                  </Input>
                  {/* {this.state.errors.} */}
                </FormGroup>
              </Col>
              <Col sm='6'>
                <FormGroup>
                  <Label className='floating-label'>
                    Amount<span className='mandatory'> *</span>
                  </Label>
                  <CInputGroup>
                    <CInputGroupText addonType='prepend'>$</CInputGroupText>
                    <Input
                      type='text'
                      className='floating-input'
                      placeholder=' '
                      name='amount'
                      onChange={handleInputChange}
                      value={amount}
                    />
                    {errors && errors.amount ? (
                      <p className={'text-danger'}>{errors.amount}</p>
                    ) : null}
                  </CInputGroup>
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label className='floating-label'>
                    Transaction ID generated from Paypal/Stripe/Phone number
                    <span className='mandatory'> *</span>
                  </Label>
                  <Input
                    type='text'
                    className='floating-input'
                    placeholder=' '
                    name='transactionId'
                    onChange={handleInputChange}
                    value={transactionId}
                    maxLength={50}
                  />
                  {errors && errors.transactionId ? (
                    <p className={'text-danger'}>{errors.transactionId}</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='exampleText'>
                    Note&nbsp;
                    <i
                      class='fa fa-info-circle'
                      aria-hidden='true'
                      id='tooltip-note'
                    ></i>
                    <UncontrolledTooltip target='tooltip-note'>
                      Notes will be shared with user via email
                    </UncontrolledTooltip>
                  </Label>
                  <Input
                    type='textarea'
                    name='note'
                    id='exampleText'
                    value={note}
                    onChange={handleInputChange}
                    maxLength={1000}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col sm='12' className='text-center'>
              <FormGroup>
                <Button
                  color=' '
                  type='submit'
                  className='mr-2 radius-btn pay-pal-btn'
                >
                  {isLoading ? (
                    <>
                      {' '}
                      <i className='fa fa-spinner fa-spin mr-1'></i> submit
                    </>
                  ) : (
                    'Mark as paid'
                  )}
                </Button>{' '}
              </FormGroup>
            </Col>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }

export default PaymentDetailModal;
