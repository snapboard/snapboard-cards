/* eslint-disable max-len */
import React from 'react'
import dayjs from 'dayjs'

const getIcon = (code) => `https://storage.googleapis.com/snapboard-static/weather/${code}.png`

const rain = <img alt='rain' width='14px' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAEFCu8CAAAABGdBTUEAALGPC/xhBQAAA75JREFUSA2NVU1oE0EUnplo0NZSi5SkN61NesrBblT0INqKIoIWPXhoRUFPHgXBIt7qSdGjCIoK9qIoFntRacGLVcymUk/Z9OdQaHbbQ8XaSq2Z8b1JZjs7m6QZCPN+vu+9tzPvTQgxV8Zxp9GWmXZTmVxBSP/3XOGANCqD75FWx/2C+9yc2M6IEAdR8VbdVYqC7bhcCCFlong0My8ayLK7ku5sK3kA6TuRpi/bKSwIQVrRtkU5FNpKbkSQJSiA2uGLZHkMS4JqlpQj63jHVbkMjVDmTuXkgn9EGdP4FSqnyo26ZKKgjJTQl6g3s2izZGadhSNcFD+hUf/ecs7iADrMJZlYLRYViW5r2ben5acJQt3OFdbglqKEsY50IjZN7Zw7KojoVmA9pbKpWpUeYbSXiaaGC8pACC1syCUJqhk3bUUu3oaOB0GZnDvJWGNPV6JpMZP3ThDO35vkEFEvi1J23krG3pgk1P0zRwUyzeCulhD8tZLNPUBMd8bbKaWlFkckpYMmIaBjJ2GTB4yGYmLYxOzSTuyyhT/evIH1VTigvRKz6vp3zPj62iwisAHkuPhwTeB8SmKgAWQ7g8L0NqbL3jsNLsWJvHtWt6lWDxwONP1uHYQyXrZpw3cCiFq37GiQD4AJNHVaJI9CDWCC9IZQPkrJYqBUdGTzy63YcgpUaReU9YeIQqx4cMYp9cTh1OpknGYYqw/+u4NO2/HOQZvJ8v8R8hVMNJHY9Qt39OsrkNHsTXwadLAuB4i6A2VO+FPTpvSaRCqEo4DmHiRq04BTYnW2nTIJIR2uYADvTP7y7s0QoE6DnXfvqDgomzR5yvAeDUKv3wo4oep0Mn47YNtEgTjDEOdMEEaH4X3oVTaazbtXOBePlUHfGaNXuxLxJ7qtkgxJMM43+C+zKvmhs22Isx+PG6aY3KsEQlstn86x895YtWTlOBb08ijKDFr3lU4OyLV8ZSAc4wOo7GiAV1ERxxAr7/DHjBf7u87vwuD0lLBiNLqV3Ui1x2Asay/4o/sNf3SNtVElL4zxSmg06yHqGHjbR+ALT+u2ajLc4UhdCTNO4RkR5JIMRMnzdLLtsh4UjuoFNE6fbjNlSDZkJeP9myaEYJ8h2CE9AJDHgXxYt6EMzdNHuLgG/4+psm+SMvrQSsSGFLZmQvgyG76sS4EDOyVZ+NKKYxDAGUrwidKceExVkyEOCpEYjVOPWDUhHOPJzQLUgzFjVE1II5GLJtjU68GEOKbB1O0pt1twct0/Xrg7ysh9qyM+ZmLr0f8D8ovEtUxGuXkAAAAASUVORK5CYII=' />
const wind = <img alt='wind' width='15px' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAYAAAGabn0pAAAABGdBTUEAALGPC/xhBQAAA0FJREFUSA2tVk1IVFEUvufNqCXp0J89ox8KxwmCJhyZaBH9QxBYm1wESlCraFWLoI0F1Spw0SZoVUaBq2rTIjH6o4Q3KoXR+CYrCN8bQUxxIKW5t+++fPLm/TmDPnHePed859x7z/3OuY+xhWdEiGp7XPrOjJo3tawh5P+iJZM13y8KzoFERW1oVYzWJFWVnABrbAMQW5cK0kbNj0yIfR6kVNREN3v0w7qx247iMWZGjS9OZdQpMCXSJuXPucmt83y+p8TmFihwDiBLw0JBRHqqWW12R8HOkJTxmQ22wZsRWJDTa8jwDSIxJQTb2Jpo9MVFM1njB4Db7WjyLfBnveFIxN5YAn4W1v8VkXYCUU3auKhlBfOkDSjnTYJdxYpS5WADMTSkG4eKgl0MRPw37MdOtrj37psIO1AmN3FCFIsvpEyMPqUSatK2Bb6HdPOUljVnkMzrgSAYFD9jkYunmOoDMtql6eYFP8ySOnk04P1jG6jpxgMUxBR0Z6UulHsSAKpFQDmOLVzCSu6Cfy9BteOMRc6FJkw6+z2YeQD6XdFB3WzjTNT4gfx1FGNcpJH97iWXHRDgWWtCPe1vK1NLSMScJHkQHslCJYpusOuKG4Nipl5GYXsWkguXUaaTYNhtd4BAWcvlrX2hK/2Bc58bGHpUIATHki1MTFFXxeM05wwQ6uwEDur5Ds75Q6dOjtEsXrfE1SOSSG5bmOxbF34OdayhV1EiZ5iiNMmypkgkLnFoKAczev6Rn0+YLir7COd0XoQeFmPTwrTjtCP3EcaLB2wFird/cYzBYDafBOHfYll1Tr0cI8U9qURjZ7Qo6Cgx0Y4GFUgxtzPyi7SKLKLci5F6y31+teuUsdnf/A4q51tLU8MTeQzDWSP9l9E79PQONIkdZZ+xZ/IKFbo+WT/N58fgth4LH5HX8gAOKl1hnGXA6fvqtcoe65ZSCvljlTWhSudVpqtIDCeb1IlKPVccj1QbP0GsbSsVWV6E9cqmtJtw7vgrRi75fUOzhV+o6xqwuA+3E26i4Mfz9RQMLbVYFy4X92U3R8b6xWwhISe1UIK9KkV7pWXtWMsZh1HRXYLRXgSaQBN6XlVHXfjMLXinKtX8A5VuWNWCJP7QAAAAAElFTkSuQmCC' />

function DailyWeather ({ weather }) {
  return (
    <div className='weather-day'>
      <img src={getIcon(weather.icon)} alt='next-weather' />
      <h5>{dayjs(new Date(weather.time * 1000)).format('ddd')}</h5>
    </div>
  )
}

function Weather ({ data }) {
  if (!data) return null
  const today = data && data[0]

  const otherDays = data ? data.slice(1) : []
  const otherDaysEl = otherDays.map((weather, i) => (
    <DailyWeather key={i} weather={weather} />
  ))

  return (
    <div className='container'>
      <div className='today'>
        <div className='left'>
          <img src={getIcon(today.icon)} alt='todays-weather' />
        </div>
        <div className='right'>
          <h1>{Math.round(today.temperatureHigh)}°</h1>
          <div className='stats'>
            <div className='stat'>
              {rain} {Math.round(today.precipProbability * 100)}%
            </div>
            <div className='stat'>
              {wind} {today.windSpeed}
            </div>
          </div>
        </div>
      </div>
      <div className='daily'>
        {otherDaysEl}
      </div>
    </div>
  )
}

export default Weather
