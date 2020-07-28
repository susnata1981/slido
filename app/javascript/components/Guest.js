import React, { useState, useEffect } from "react"

export default function Guest(props) {
  console.log(props);

  const [isLoading, setIsLoading] = useState('')
  const [guest, setGuest] = useState('')

  useEffect(() => {
    fetch(
      `/v1/guest/${props.match.params.id}`,
      {
        method: 'GET',
      }).then(response => response.json())
      .then(r => {
        console.log(r)
        setGuest(r)
      });
  }, [])

  if (isLoading) {
    return (
      <React.Fragment>
        <h2>Loading Guest</h2>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <ul>
        <li>Name: {guest.firstname} {guest.lastname}</li>
        <li>Joined: {new Date(guest.created_at).toLocaleDateString()}</li>
      </ul>
    </React.Fragment>
  )
}