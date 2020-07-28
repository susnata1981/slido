import React from "react"
import { useEffect, useState } from 'react';

import PropTypes from "prop-types"
import { useForm } from 'react-hook-form'

export default function Question() {

  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    fetch('/v1/questions')
    .then(response => response.json())
    .then(data => {
      setIsLoading(false)
      setQuestions(data.questions)
    })
  }, [questions]);

  return (
    <React.Fragment>
      <AskQuestion questions={questions} />

     { !isLoading && questions.map(q => {
        return <p>{q.content}</p>
      })
      }
    </React.Fragment>
  )
}

function AskQuestion() {
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('question[content]', data.content)
    
    fetch(
      '/v1/questions/create',
      {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
      .then(data => this.props.questions.append(data))
  }

  return (
    <React.Fragment>
      <div>
        <h2>Question</h2>

        <form onClick={handleSubmit(onSubmit)}>
          <label>Question</label>
          <input
            type="text"
            name="content"
            placeholder="Question..."
            ref={register({ required: 'this is a required field' })}
          />
          {errors.content && errors.content.message}

          <input type="submit" value="Post" />
        </form>
      </div>
    </React.Fragment>
  )
}
