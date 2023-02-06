import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react'
import AuthContext from '../../store/auth-context'
import Card from '../UI/Card/Card'
import Input from '../UI/Input/Input'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'

const ACTIONS = {
  USER_INPUT: 'user-input',
  INPUT_BLUR: 'input-blur',
}

const emailReducer = (state, action) => {
  if (action.type === ACTIONS.USER_INPUT) {
    return {
      value: action.payload,
      isValid: action.payload.includes('@'),
    }
  }
  if (action.type === ACTIONS.INPUT_BLUR) {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: null }
}

const passwordReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.USER_INPUT:
      return {
        value: action.payload,
        isValid: action.payload.trim().length > 6,
      }
    case ACTIONS.INPUT_BLUR:
      return { value: state.value, isValid: state.value.trim().length > 6 }
    default:
      return { value: '', isValid: null }
  }
}

const Login = () => {
  // const [enteredEmail, setEnteredEmail] = useState('')
  // const [emailIsValid, setEmailIsValid] = useState()
  // const [enteredPassword, setEnteredPassword] = useState('')
  // const [passwordIsValid, setPasswordIsValid] = useState()
  const [formIsValid, setFormIsValid] = useState(null)

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  })

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  })

  const ctx = useContext(AuthContext)

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  // emailIsValid and passWordIsValid is an alias of isValid and is achieved through object destructuring
  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('checking from validity 1st')
      setFormIsValid(emailIsValid && passwordIsValid)
    }, 2000)

    return () => {
      console.log('cleanup 2nd')
      clearTimeout(identifier)
    }
  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: ACTIONS.USER_INPUT, payload: event.target.value })

    // setFormIsValid(emailState.isValid && passwordState.isValid)
  }

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: ACTIONS.USER_INPUT,
      payload: event.target.value,
    })

    // setFormIsValid(emailState.isValid && passwordState.isValid)
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: ACTIONS.INPUT_BLUR })
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: ACTIONS.INPUT_BLUR })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value)
    } else if (!emailIsValid) {
      emailInputRef.current.focus()
    } else {
      passwordInputRef.current.focus()
    }
  }

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login
