import React, { useState, useEffect } from 'react';
import { Popover, PopoverHeader, PopoverBody, ButtonGroup, Button } from 'reactstrap';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

import FontAwesomeButton from './FontAwesomeButton';

const DeleteButton = ({ buttonId, children, itemId, defaultEndDate, onDeleteClicked, onComplete, ...props }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(false);
  const [focusClassName, setFocusClassName] = useState('');

  useEffect(() => {
    if (defaultEndDate) setDate(moment(defaultEndDate));
  }, [defaultEndDate]);

  const togglePopover = () => setPopoverOpen(!popoverOpen);

  const handleDatePickerFocusChange = focused => {
    setFocusedInput(focused);

    focused ? setFocusClassName('focused') : setFocusClassName('');
  };

  const handleConfirmDelete = () => {
    togglePopover();
    onDeleteClicked(itemId, date);
  };

  return (
    <React.Fragment>
      <FontAwesomeButton color="danger" icon="trash-alt" id={buttonId} {...props} />
      <Popover placement="bottom" isOpen={popoverOpen} target={buttonId} toggle={togglePopover}>
        <PopoverHeader>Are you sure?</PopoverHeader>
        <PopoverBody>
          <div className={`DatePickerWrapper ${focusClassName}`}>
            <SingleDatePicker
              id={`${buttonId}_endDate`}
              date={date}
              onDateChange={date => setDate(date)}
              focused={focusedInput}
              onFocusChange={({ focused }) => handleDatePickerFocusChange(focused)}
              hideKeyboardShortcutsPanel={true}
              numberOfMonths={1}
              transitionDuration={0}
              small
              block
              noBorder
              showDefaultInputIcon={true}
              inputIconPosition="after"
              placeholder="End Date"
            />
          </div>
          <div className="text-right mt-3">
            <ButtonGroup>
              <Button color="danger" size="sm" onClick={handleConfirmDelete}>
                Delete
              </Button>
              <Button color="secondary" size="sm" onClick={togglePopover}>
                Cancel
              </Button>
            </ButtonGroup>
          </div>
        </PopoverBody>
      </Popover>
    </React.Fragment>
  );
};

export default DeleteButton;
