import { Field, Formik, FormikActions, FormikProps } from 'formik'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {
  FieldWrapper,
  Label,
  StyledLoadingButton,
} from '../../../components/AnonymousLayout/components/FormComponents'
import FormikEffect from '../../../components/Form/FormikEffect'
import InputFormik from '../../../components/Form/InputFormik'
import { HTTP_STATUS_UNAUTHORIZED } from '../../../constants/http'
import useThunkDispatch from '../../../hooks/useThunkDispatch'
import { login } from '../../../state/actions/sessionActions'
import { Message } from '../../../types/Message'
import { validateSchema } from '../../../yup'

const LoginSchema = Yup.object().shape<FormValues>({
  username: Yup.string().required(),
  password: Yup.string().required(),
})

interface FormValues {
  username: string
  password: string
}

interface Props {
  setMessage: (value: Message) => void
}

const LoginForm: React.FC<Props> = ({ setMessage }) => {
  const { t } = useTranslation('login')
  const dispatch = useThunkDispatch()

  const handleLogin = useCallback(
    async (
      { username, password }: FormValues,
      { setSubmitting }: FormikActions<FormValues>
    ) => {
      try {
        await dispatch(login(username, password))
      } catch (e) {
        setSubmitting(false)

        if (e.response.status === HTTP_STATUS_UNAUTHORIZED) {
          setMessage({ type: 'error', text: t('invalid-credentials') })
        } else {
          setMessage({ type: 'error', text: t('form-error') })
        }
      }
    },
    [dispatch, setMessage, t]
  )

  const initialValues: FormValues = { username: '', password: '' }

  const renderForm = (props: FormikProps<FormValues>) => {
    const { handleSubmit, isSubmitting } = props
    return (
      <form onSubmit={handleSubmit}>
        <FormikEffect
          onChange={(prevProps, nextProps) => {
            if (prevProps && prevProps.values !== nextProps.values) {
              setMessage(undefined)
            }
          }}
          formik={props}
        />
        <FieldWrapper>
          <Label>{t('username')}</Label>
          <Field name="username" component={InputFormik} hasContainer={false} />
        </FieldWrapper>
        <FieldWrapper>
          <Label>{t('password')}</Label>
          <Field
            type="password"
            name="password"
            component={InputFormik}
            hasContainer={false}
          />
        </FieldWrapper>

        <StyledLoadingButton
          width="100%"
          type="submit"
          isLoading={isSubmitting}
        >
          {t('login')}
        </StyledLoadingButton>
      </form>
    )
  }

  return (
    <Formik<FormValues>
      onSubmit={handleLogin}
      initialValues={initialValues}
      render={renderForm}
      validate={values => validateSchema(values, LoginSchema)}
    />
  )
}
export default LoginForm
