import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';

import MultiSelect from '../ui/MultiSelect';
import SingleDateField from '../ui/SingleDateField';
import Spinner from '../ui/Spinner';
import { FormRow, FormInput } from './FormInputs';
import FormModal from './FormModal';

import {} from '../../actions';

import * as api from '../../Api';
import * as Constants from '../../Constants';

const defaultValues = {
  name: '',
  description: '',
  permissions: [],
  endDate: null,
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Required')
    .max(30)
    .trim(),
  description: Yup.string()
    .required('Required')
    .max(150)
    .trim(),
  permissions: Yup.array().required('Require at least one permission'),
});

const EditRoleFormFields = ({ permissionIds, disableEdit }) => {
  return (
    <React.Fragment>
      <FormRow name="name" label="Role Name*">
        <FormInput type="text" name="name" placeholder="Role Name" disabled={disableEdit} />
      </FormRow>
      <FormRow name="description" label="Role Description*">
        <FormInput type="text" name="description" placeholder="Role Description" disabled={disableEdit} />
      </FormRow>
      <FormRow name="permissions" label="Permissions*">
        <MultiSelect items={permissionIds} name="permissions" showId={false} />
      </FormRow>
      <FormRow name="endDate" label="End Date">
        <SingleDateField name="endDate" placeholder="End Date" />
      </FormRow>
    </React.Fragment>
  );
};

const EditRoleForm = ({ toggle, isOpen, formType, roleId }) => {
  // This is needed until Formik fixes its own setSubmitting function
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [permissionIds, setPermissionIds] = useState([]);

  useEffect(() => {
    api.getPermissions().then(response => {
      setPermissionIds(response.data);
      setLoading(false);

      if (formType === Constants.FORM_TYPE.ADD) {
        setLoading(false);
      } else {
        return api.getRole(roleId).then(response => {
          setInitialValues({
            ...response.data,
            endDate: response.data.endDate ? moment(response.data.endDate) : null,
          });
        });
      }
    });
  }, [formType, roleId]);

  const handleFormSubmit = values => {
    if (!submitting) {
      setSubmitting(true);

      if (formType === Constants.FORM_TYPE.ADD) {
        api.postRole(values).then(() => {
          setSubmitting(false);
          toggle(true);
        });
      } else {
        api.putRole(roleId, values).then(() => {
          setSubmitting(false);
          toggle(true);
        });
      }
    }
  };

  const title = formType === Constants.FORM_TYPE.ADD ? 'Add User' : 'Edit User';

  return (
    <FormModal
      isOpen={isOpen}
      toggle={toggle}
      title={title}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      submitting={submitting}
    >
      {loading ? <Spinner /> : <EditRoleFormFields permissionIds={permissionIds} />}
    </FormModal>
  );
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, {})(EditRoleForm);
