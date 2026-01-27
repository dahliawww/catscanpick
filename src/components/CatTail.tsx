export default function CatTail() {
  return (
    <div className="absolute h-auto pointer-events-none -top-12 inset-x-1/4 md:inset-x-1/3 cat-wrapper">
      <div className="cat-figure">
        {/* Body */}
        <div className="cat-body"></div>

        {/* Head */}
        <div className="cat-head">
          {/* Ears */}
          <div className="cat-ear cat-ear-left"></div>
          <div className="cat-ear cat-ear-right"></div>
        </div>

        {/* Tail Container */}
        <div className="cat-tail-container">
          <div className="cat-tail-segment">
            <div className="cat-tail-segment">
              <div className="cat-tail-segment">
                <div className="cat-tail-segment">
                  <div className="cat-tail-segment">
                    <div className="cat-tail-segment">
                      <div className="cat-tail-segment"></div>
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
