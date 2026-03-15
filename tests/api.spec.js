import { test, expect } from '@playwright/test'
const baseURL = 'https://restful-booker.herokuapp.com';
let newUser;
let bookingid;
let tok;

test.describe("API verification", () => {


  test("Vrify POST request", async ({ request }) => {
    newUser = {
      firstname: 'Grzegosz',
      lastname: 'Brzęczyszczykiewicz',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2026-02-16",
        checkout: "2026-03-18"
      },
      additionalneeds: "bucket, 5L bottle of water, aluminum foil, 10 packs of skittles "
    }

    const response = await request.post(`${baseURL}/booking`, {
      data: newUser
    })

    const responseBody = await response.json()

    bookingid = responseBody.bookingid

    expect(response.status()).toBe(200)
    expect(responseBody).toHaveProperty('bookingid')
    expect(responseBody.booking.firstname).toBe(newUser.firstname)
    expect(responseBody.booking.lastname).toBe(newUser.lastname)
    expect(responseBody.booking.totalprice).toBe(newUser.totalprice)
    expect(responseBody.booking.depositpaid).toBe(newUser.depositpaid)
    expect(responseBody.booking.bookingdates.checkin).toBe(newUser.bookingdates.checkin)
    expect(responseBody.booking.bookingdates.checkout).toBe(newUser.bookingdates.checkout)
    expect(responseBody.booking.additionalneeds).toBe(newUser.additionalneeds)
  })



  test('GET method test', async ({ request }) => {

    const response = await request.get(`${baseURL}/booking/${bookingid}`)

    const responseBody = await response.json()

    console.log(responseBody)
    expect(response.status()).toBe(200)
    expect(responseBody.firstname).toBe(newUser.firstname)
    expect(responseBody.lastname).toBe(newUser.lastname)
    expect(responseBody.totalprice).toBe(newUser.totalprice)
    expect(responseBody.depositpaid).toBe(newUser.depositpaid)
    expect(responseBody.bookingdates.checkin).toBe(newUser.bookingdates.checkin)
    expect(responseBody.bookingdates.checkout).toBe(newUser.bookingdates.checkout)
    expect(responseBody.additionalneeds).toBe(newUser.additionalneeds)
  })


  test('Verify PUT request', async ({ request }) => {
    console.log('Booking ID:', bookingid);
    const credentials = {
      username: 'admin',
      password: 'password123'
    }

    const updateUser = {
      firstname: 'Janusz',
      lastname: 'Biznesu',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2026-02-16",
        checkout: "2026-03-18"
      },
      additionalneeds: "bucket, 5L bottle of water, aluminum foil, 10 packs of skittles"
    }

    const tokenjson = await request.post(`${baseURL}/auth`, {
      data: credentials
    })

    tok = await tokenjson.json()
    // console.log(tok)

    const response = await request.put(`${baseURL}/booking/${bookingid}`, {
      headers: {
        'Cookie': `token=${tok.token}`
      },
      data: updateUser
    })
    const responseBody = await response.json()

    expect(response.status()).toBe(200)
    expect(responseBody.firstname).toBe(updateUser.firstname)
    expect(responseBody.lastname).toBe(updateUser.lastname)

  })


  test('Delete user', async ({ request }) => {
    const response = await request.delete(`${baseURL}/booking/${bookingid}`, {
      headers: {
        'Cookie': `token=${tok.token}`
      },
    })
    console.log(response)
    expect(response.status()).toBe(201)

    //Confirm deletion
    const confirmation = await request.get(`${baseURL}/booking/${bookingid}`)
    expect(confirmation.status()).toBe(404)


  })

})