<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/CharlZKP/R.O.S.W.E.L">
    <img src="https://www.roswel-th.com/dist/image/logo/ROSWEL_logo_wbg.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">R.O.S.W.E.L</h3>

  <p align="center">
    R.O.S.W.E.L stands for Remote Ordering System Without Excessive Labor
  It is a platform for ordering goods our current main target customer are 
  customers around Chaing Mai University (CMU) 
  where the deliverer could only be students in CMU.
    <br />
    <a href="https://www.roswel-th.com"><strong>Try our site »</strong></a>
    <br />
    <br />
    <a href="https://github.com/CharlZKP/R.O.S.W.E.L/issues">Report Bug</a>
    ·
    <a href="https://github.com/CharlZKP/R.O.S.W.E.L/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

 R.O.S.W.E.L stands for Remote Ordering System Without Excessive Labor
  It is a platform for ordering goods our current main target customer are 
  customers around Chaing Mai University (CMU) 
  where the deliverer could only be students in CMU, after passing a KYC proccess
  and approved by the Admin

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Express](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [Redis](https://redis.io/)
* [MongoDB](https://www.mongodb.com/)
* [Socket.IO](https://socket.io/)
* [Svelte](https://svelte.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Routify](https://www.routify.dev/)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
* Install Node.JS

### Installation

1. Get all API Keys including thSMS and SendGrid

2. Get CMU OAuth Hubhoo configs (To enable CMU OAuth)

3. Clone the repo
   ```sh
   git clone https://github.com/CharlZKP/R.O.S.W.E.L.git
   ```

4. Install NPM packages
   ```sh
   npm install
   ```

5. Edit the backend configs in `build/config.js` 
Most configs are required
Search the config file for "Needed" comment
Example: 
   ```js
   ... //Other configs
   sendGrid {
    sender_email: 'no-reply@roswel-th.com', //Needed
    apiKey: 'YOUR-SENDGRID-API-KEY' //Needed
  },
   ```
and check the CORS and Cookies config so that it matches with
your setup

6. Run the backend by using the script
   ```sh
   npm run start
   ```

 Or run directly using 
    ```sh
   node build/index.js
   ```

7. Open the  `client` directory and install dependancies 
   (Usually the Frontend and the Backend are separatable 
   but in this version, we put it in the same repo with no Submodules
   just for simplicity)
   ```sh
   npm install
   ```

8. Change the variable in `client\src\services\Api.ts` to be the endpoint
of your Backend server
   ```js
   export const server_base_url = "http://localhost:2000";
    ```
Be sure to check the Backend CORS and cookies config so that
it matches with your Frontend URL

9. and run the **dev** server using
   ```sh
   npm run dev
   ```


<p align="right">(<a href="#top">back to top</a>)</p>




<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Do not forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

The Front-end is opensource under [3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause "The 3-Clause BSD License")
Currently, the Back-end, the logo, and some image are "All rights reserved".

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

[Warach Duangjit](https://www.linkedin.com/in/warach-duangjit/ "Warach Duangjit")
[Rawit Pichitpatja](https://www.linkedin.com/in/rawit-pichitpatja-3484b3212/ "Rawit Pichitpatja")

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thank you all contributors for all the support you gave us.
Thanks ThisGameZ for helping with the admin page

<p align="right">(<a href="#top">back to top</a>)</p>

