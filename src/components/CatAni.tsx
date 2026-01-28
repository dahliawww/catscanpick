export default function CatAni() {
  return (
    <div className="absolute h-auto pointer-events-none -top-14 left-10 md:-top-20 md:left-32 md:translate-x-0 cat-ani-wrapper">
      <div className="cat-ani-figure">
        {/* Body - SVG */}
        <div className="cat-ani-body">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 544.85 208.1"
            className="cat-ani-body-svg"
          >
            <path
              fill="#cbd5e1"
              d="M495.42,135.13c-.54-.89-.96-1.53-1.15-1.83-.04-.06-.08-.12-.11-.19-6.76-12.14-14.22-23.17-24.1-33.23-14.88-15.14-32.28-26.58-51.82-34.52-54.09-21.99-112.71-18.72-167,1.39l-31.84,11.8c-11.35,4.2-28.52,8.55-40.5,6.29-2.48-6.57-7.72-10.57-11.05-16.42-7.7-13.5-16.37-25.95-28.78-35.57-1.93-1.5-4.61-3.16-6.61-1.69-2.19,1.61-2.81,4.77-3.43,7.3-2.43,9.93-3.52,19.85-5.35,30.14-8.73,1.27-16.95,3.9-25.05,7.81-7.74-5.67-21.99-15.93-30.23-18.62-11.24-3.67,2.47,38.49,4.44,43.13-4.07,8.17-6.17,16.83-5.81,25.8-.04,3.99.41,8.1,1.61,12.06,3.93,12.96,16,24.33,46.07,24.69h3.09s85.76.02,85.76.02h290.88c.28,0,.56,0,.83,0v.03c.25,0,.48-.01.71-.02,15.01-.78,3.5-21.68-.57-28.36Z"
            />
          </svg>
        </div>

        {/* Front Paws (animated) */}
        <div className="cat-ani-paws">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 111.12 25.42"
            className="cat-ani-paw-svg cat-ani-paw-left"
          >
            <path
              fill="#cbd5e1"
              d="M111.12,12.79c0-7.06-5.73-12.79-12.79-12.79h-47.88c0,.14-.02.28-.07.4-2.07.27-4.42.64-6.38.54-2.14-.43-4.73.31-6.87.39l-4.45.17c-6.03.24-12.09.61-18.32,1.77-4.48.83-8.77,2.38-11.76,5.84C.09,12.01-.74,15.73.71,19.42c1.79,2.94,4.72,5.1,8.18,5.86.03,0,.06,0,.09.01,7.55.51,14.86-.04,22.13-.04l70.01.02c5.72-1.27,10.01-6.37,10.01-12.48Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 111.12 25.42"
            className="cat-ani-paw-svg cat-ani-paw-right"
          >
            <path
              fill="#cbd5e1"
              d="M111.12,12.79c0-7.06-5.73-12.79-12.79-12.79h-47.88c0,.14-.02.28-.07.4-2.07.27-4.42.64-6.38.54-2.14-.43-4.73.31-6.87.39l-4.45.17c-6.03.24-12.09.61-18.32,1.77-4.48.83-8.77,2.38-11.76,5.84C.09,12.01-.74,15.73.71,19.42c1.79,2.94,4.72,5.1,8.18,5.86.03,0,.06,0,.09.01,7.55.51,14.86-.04,22.13-.04l70.01.02c5.72-1.27,10.01-6.37,10.01-12.48Z"
            />
          </svg>
        </div>

        {/* Tail Container (animated) */}
        <div className="cat-ani-tail-container">
          <div className="cat-ani-tail-segment">
            <div className="cat-ani-tail-segment">
              <div className="cat-ani-tail-segment">
                <div className="cat-ani-tail-segment">
                  <div className="cat-ani-tail-segment">
                    <div className="cat-ani-tail-segment">
                      <div className="cat-ani-tail-segment"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
