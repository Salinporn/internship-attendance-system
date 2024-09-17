/* Defining the host and backend port explicitly for deployment on IIS. */
/* This ensures the frontend can communicate with the backend, even if */
/* the IIS configuration doesn't properly forward relative URLs. */

export const HOST = "xxx.xx.xx.xx"; /*IP address*/
export const BACKEND_PORT = "3001";
