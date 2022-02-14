import { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./css/ProductGrid.css";
import "./css/Navbar.css";
import "./css/ColorDisplay.css";
import "./css/DesignersDisplay.css";
import "./css/SearchBar.css";
import "./css/FilterTag.css"

function Sneakers() {
  //TO FETCH WITH AXIOS
  //http://localhost:3000/products.json
  //https://www.boldwintips.com/products.json

  const url = "https://www.boldwintips.com/products.json";

  //RESPONSE BY AXIOS
  const [Apidata, setApidata] = useState([]);

  //DATA WHAT IF FINALLY DISPLAYED
  const [displayData, setDisplayData] = useState([]);

  //FETCH DATA
  useEffect(() => {
    axios.get(url).then((res) => setApidata(res.data));
  }, []);

  //AVAILABLE BRANDS AND COLORS TO DISPLAY FIRST DECLARATION
  const [availableBrandsToDisplay, setAvailableBrandsToDisplay] = useState([]);
  const [baseAvailableBrandsToDisplay, setBaseAvailableBrandsToDisplay] =
    useState([]);
  const [availableColorsToDisplay, setAvailableColorsToDisplay] = useState([]);
  const [baseAvailableColorsToDisplay, setBaseAvailableColorsToDisplay] =
    useState([]);

  //FETCH DISPLAY DATA
  useEffect(() => {
    if (Apidata.length >> 0) {
      var setForDisplayData = Apidata.slice(0, 12);
      setDisplayData(setForDisplayData);

      var a = [];
      var b = [];

      Apidata.map((object) => {
        if (a.indexOf(object.creator.toLowerCase()) === -1) {
          a.push(object.creator.toLowerCase());
          b.push({
            creator: object.creator.toLowerCase(),
            textDecoration: "none",
          });
        }
        return null;
      });

      setAvailableBrandsToDisplay(b);
      setBaseAvailableBrandsToDisplay(b);

      var c = [];
      var d = [];

      Apidata.map((object) => {
        if (c.indexOf(object.colorname.toLowerCase()) === -1) {
          c.push(object.colorname.toLowerCase());
          d.push({
            colorname: object.colorname,
            backgroundColor: object.colordot,
            boxShadow: "0px 0px 0px 1px lightgray",
          });
        }
        return null;
      });

      setAvailableColorsToDisplay(d);
      setBaseAvailableColorsToDisplay(d);
    }
  }, [Apidata]);

  //OBSERVER FOR INFINITE SCROLLER
  const listInnerRef = useRef();
  //INFINITE SCROLLER
  function onScroll() {
    if (filteredData.length === 0) {
      
      if (listInnerRef.current) {
        
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        
        if (scrollTop + clientHeight >= scrollHeight) {
          let l = displayData.length;
          let o = displayData[l - 1];
          let i = Apidata.indexOf(o) + 1;
          let p = i + 9;
          let x = Apidata.slice(i, p);
          setTimeout(() => {
            setDisplayData(displayData.concat(x));
          }, 100);
        }
      }
    } else {
      
      if (listInnerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          let l = displayData.length;
          let o = displayData[l - 1];
          let i = filteredData.indexOf(o) + 1;
          let p = i + 9;
          let x = filteredData.slice(i, p);
          setTimeout(() => {
            setDisplayData(displayData.concat(x));
          }, 100);
        }
      }
    }
  }

  const [colorDisplayVisibility, setColorDisplayVisibility] = useState("none");

  //COLOR DISPLAY BUTTON COUNTER
  const [colorDisplayButtonCounter, setColorDisplayButtonCounter] = useState(0);

  //OPEN COLOR DISPLAY FUNCTION
  function openColorDisplay() {
    if (searchCloseVisibility === "block") {
      closeSearch();
    }

    var a = colorDisplayButtonCounter;
    ++a;
    setColorDisplayButtonCounter(a);

    if (a % 2 === 1) {
      setColorDisplayVisibility("block");
    } else {
      setColorDisplayVisibility("none");
    }

    if (designerDisplayVisibility === "block") {
      setDesignerDisplayVisibility("none");
      setDesignerDisplayButtonCounter(0);
    }
  }

  const [designerDisplayVisibility, setDesignerDisplayVisibility] =
    useState("none");

  //DESIGNER DISPLAY BUTTON COUNTER
  const [designerDisplayButtonCounter, setDesignerDisplayButtonCounter] =
    useState(0);

  //OPEN DESIGNER DISPLAY FUNCTION
  function openDesignerDisplay() {
    if (searchCloseVisibility === "block") {
      closeSearch();
    }

    var a = designerDisplayButtonCounter;
    ++a;
    setDesignerDisplayButtonCounter(a);

    if (a % 2 === 1) {
      setDesignerDisplayVisibility("block");
    } else {
      setDesignerDisplayVisibility("none");
    }

    if (colorDisplayVisibility === "block") {
      setColorDisplayVisibility("none");
      setColorDisplayButtonCounter(0);
    }
  }

  const searchDesigners = (e) => {
    var f = [];

    baseAvailableBrandsToDisplay.map((object) => {
      if (object.creator.includes(e.target.value.toLowerCase())) {
        f.push(object);
      }
      return null;
    });

    setAvailableBrandsToDisplay(f);
  };

  const [filteringColorList, setFilteringColorList] = useState([]);

  const addColorToFilter = (e) => {
    var g = [];

    availableColorsToDisplay.map((object) => {
      if (g.indexOf(object.colorname) === -1) {
        g.push(object.colorname);
      }

      return null;
    });

    var h = g.indexOf(e.target.getAttribute("colorname"));

    if (e.target.getAttribute("boxshadow") === "0px 0px 0px 1px lightgray") {
      availableColorsToDisplay[h] = {
        colorname: e.target.getAttribute("colorname"),
        backgroundColor: e.target.getAttribute("backgroundcolor"),
        boxShadow: "0px 0px 0px 1px rgb(0, 0, 0)",
      };
      var i = filteringColorList;
      i.push(e.target.getAttribute("colorname"));
      setFilteringColorList(i);
    } else {
      availableColorsToDisplay[h] = {
        colorname: e.target.getAttribute("colorname"),
        backgroundColor: e.target.getAttribute("backgroundcolor"),
        boxShadow: "0px 0px 0px 1px lightgray",
      };

      let i = filteringColorList.indexOf(e.target.getAttribute("colorname"));

      var j = filteringColorList;
      j.splice(i, 1);
      setFilteringColorList(j);
      if (j.length === 0) {
        filterDisplayDataByDesignersOnly();
      }
    }

    setAvailableColorsToDisplay(availableColorsToDisplay);

    setColorDisplayVisibility("none");
    setColorDisplayButtonCounter(0);

    setDesignerDisplayVisibility("none");
    setDesignerDisplayButtonCounter(0);

    if (filteringBrandsList.length === 0 && filteringColorList.length >> 0) {
      filterDisplayDataByColorsOnly();
    } else if (filteringColorList.length >> 0) {
      filterByBoth();
    } else if (
      filteringColorList.length === 0 &&
      filteringBrandsList.length === 0
    ) {
      filterDisplayDataByDesignersOnly();

      var k4 = [];
      var l4 = [];

      Apidata.map((object) => {
        if (k4.indexOf(object.creator) === -1) {
          k4.push(object.creator);
          l4.push({ creator: object.creator, textDecoration: "none" });
        }
        return null;
      });

      setAvailableBrandsToDisplay(l4);
    } else if (
      filteringColorList.length === 0 &&
      filteringBrandsList.length >> 0
    ) {
      // FILTER APIDATA BY COLORS SO I CAN MAKE A WORKING FILTERED DESIGNERS DISPLAY
      var t = [];

      Apidata.map((object) => {
        t.push(object);
        return null;
      });

      var tbnorepeat = [];
      var tbrands = [];

      t.map((object) => {
        if (tbnorepeat.indexOf(object.creator.toLowerCase()) === -1) {
          tbnorepeat.push(object.creator.toLowerCase());
          tbrands.push({
            creator: object.creator.toLowerCase(),
            textDecoration: "none",
          });
        }
        return null;
      });

      tbnorepeat.map((object) => {
        if (filteringBrandsList.indexOf(object) !== -1) {
          tbrands[tbnorepeat.indexOf(object)] = {
            creator: object,
            textDecoration: "line-through",
          };
        }
        return null;
      });

      setAvailableBrandsToDisplay(tbrands);
    }
    createFilterTags()
  };

  const [filteredData, setFilteredData] = useState([]);

  function filterDisplayDataByColorsOnly() {
    var h = [];
    if (filteringColorList.length >> 0) {
      Apidata.map((object) => {
        if (filteringColorList.indexOf(object.colorname) !== -1) {
          h.push(object);
        }
        return null;
      });

      setFilteredData(h);

      setDisplayData(h.slice(0, 12));

      var k3 = [];
      var l3 = [];

      h.map((object) => {
        if (k3.indexOf(object.creator) === -1) {
          k3.push(object.creator);
          l3.push({ creator: object.creator, textDecoration: "none" });
        }
        return null;
      });

      setAvailableBrandsToDisplay(l3);
    } else {
      var k4 = [];
      var l4 = [];

      Apidata.map((object) => {
        if (k4.indexOf(object.creator) === -1) {
          k4.push(object.creator);
          l4.push({ creator: object.creator, textDecoration: "none" });
        }
        return null;
      });

      setAvailableBrandsToDisplay(l4);

      setFilteredData([]);

      setDisplayData(Apidata.slice(0, 12));
    }
    createFilterTags()
  }

  const [filteringBrandsList, setFilteringBrandsList] = useState([]);

  const addBrandToFilter = (e) => {
    var g2 = [];

    availableBrandsToDisplay.map((object) => {
      if (g2.indexOf(object.creator) === -1) {
        g2.push(object.creator);
      }

      return null;
    });

    var h2 = g2.indexOf(e.target.getAttribute("brand"));

    if (e.target.getAttribute("textdec") === "none") {
      availableBrandsToDisplay[h2] = {
        creator: e.target.getAttribute("brand"),
        textDecoration: "line-through",
      };
      var i2 = filteringBrandsList;
      i2.push(e.target.getAttribute("brand").toLowerCase());
      setFilteringBrandsList(i2);
    } else {
      availableBrandsToDisplay[h2] = {
        creator: e.target.getAttribute("brand"),
        textDecoration: "none",
      };

      let i2 = filteringBrandsList.indexOf(e.target.getAttribute("brand"));

      var j2 = filteringBrandsList;
      j2.splice(i2, 1);
      setFilteringBrandsList(j2);

      if (j2.length === 0) {
        filterDisplayDataByColorsOnly();
      }
    }

    setColorDisplayVisibility("none");
    setColorDisplayButtonCounter(0);

    setDesignerDisplayVisibility("none");
    setDesignerDisplayButtonCounter(0);

    if (filteringColorList.length === 0 && filteringBrandsList.length >> 0) {
      filterDisplayDataByDesignersOnly();
    } else if (filteringBrandsList.length >> 0) {
      filterByBoth();
    } else if (
      filteringBrandsList.length === 0 &&
      filteringColorList.length === 0
    ) {
      filterDisplayDataByColorsOnly();

      var k2 = [];
      var l2 = [];

      Apidata.map((object) => {
        if (k2.indexOf(object.colorname) === -1) {
          k2.push(object.colorname);
          l2.push({
            colorname: object.colorname,
            backgroundColor: object.colordot,
            boxShadow: "0px 0px 0px 1px lightgray",
          });
        }
        return null;
      });

      setAvailableColorsToDisplay(l2);
    } else if (
      filteringBrandsList.length === 0 &&
      filteringColorList.length >> 0
    ) {
      var unames = [];
      var uobjects = [];

      Apidata.map((object) => {
        if (unames.indexOf(object.colorname) === -1) {
          unames.push(object.colorname);
          uobjects.push({
            colorname: object.colorname,
            backgroundColor: object.colordot,
            boxShadow: "0px 0px 0px 1px lightgray",
          });
        }
        return null;
      });

      uobjects.filter((object) => {
        if (filteringColorList.indexOf(object.colorname) !== -1) {
          uobjects[unames.indexOf(object.colorname)] = {
            colorname: object.colorname,
            backgroundColor: object.backgroundColor,
            boxShadow: "0px 0px 0px 1px rgb(0, 0, 0)",
          };
        }
        return null;
      });

      setAvailableColorsToDisplay(uobjects);
    }
    createFilterTags()
  };

  function filterDisplayDataByDesignersOnly() {
    var h2 = [];
    if (filteringBrandsList.length >> 0) {
      Apidata.map((object) => {
        if (filteringBrandsList.indexOf(object.creator.toLowerCase()) !== -1) {
          h2.push(object);
        }
        return null;
      });

      setFilteredData(h2);

      setDisplayData(h2.slice(0, 12));

      var k = [];
      var l = [];

      h2.map((object) => {
        if (k.indexOf(object.colorname) === -1) {
          k.push(object.colorname);
          l.push({
            colorname: object.colorname,
            backgroundColor: object.colordot,
            boxShadow: "0px 0px 0px 1px lightgray",
          });
        }
        return null;
      });

      setAvailableColorsToDisplay(l);
    } else {
      var k2 = [];
      var l2 = [];

      Apidata.map((object) => {
        if (k2.indexOf(object.colorname) === -1) {
          k2.push(object.colorname);
          l2.push({
            colorname: object.colorname,
            backgroundColor: object.colordot,
            boxShadow: "0px 0px 0px 1px lightgray",
          });
        }
        return null;
      });

      setAvailableColorsToDisplay(l2);

      setFilteredData([]);

      setDisplayData(Apidata.slice(0, 12));
    }
    
    createFilterTags()
  }

  function filterByBoth() {
    var q = [];

    //FILTER BY BRANDS
    Apidata.map((object) => {
      if (filteringBrandsList.indexOf(object.creator.toLowerCase()) !== -1) {
        q.push(object);
      }
      return null;
    });

    var shelper = [];
    var s = [];

    q.map((object) => {
      if (shelper.indexOf(object.colorname) === -1) {
        shelper.push(object.colorname);
        s.push({
          colorname: object.colorname,
          backgroundColor: object.colordot,
          boxShadow: "0px 0px 0px 1px lightgray",
        });
      }
      return null;
    });

    s.map((object) => {
      if (filteringColorList.indexOf(object.colorname) !== -1) {
        s[shelper.indexOf(object.colorname)] = {
          colorname: object.colorname,
          backgroundColor: object.backgroundColor,
          boxShadow: "0px 0px 0px 1px rgb(0, 0, 0)",
        };
      }
      return null;
    });

    setAvailableColorsToDisplay(s);

    var r = [];

    q.map((object) => {
      if (filteringColorList.indexOf(object.colorname.toLowerCase()) !== -1) {
        r.push(object);
      }
      return null;
    });

    // FILTER APIDATA BY COLORS SO I CAN MAKE A WORKING FILTERED DESIGNERS DISPLAY
    var t = [];

    Apidata.map((object) => {
      if (filteringColorList.indexOf(object.colorname) !== -1) {
        t.push(object);
      }
      return null;
    });

    var tbnorepeat = [];
    var tbrands = [];

    t.map((object) => {
      if (tbnorepeat.indexOf(object.creator.toLowerCase()) === -1) {
        tbnorepeat.push(object.creator.toLowerCase());
        tbrands.push({
          creator: object.creator.toLowerCase(),
          textDecoration: "none",
        });
      }
      return null;
    });

    tbnorepeat.map((object) => {
      if (filteringBrandsList.indexOf(object) !== -1) {
        tbrands[tbnorepeat.indexOf(object)] = {
          creator: object,
          textDecoration: "line-through",
        };
      }
      return null;
    });

    setAvailableBrandsToDisplay(tbrands);

    setFilteredData(r);

    setDisplayData(r.slice(0, 12));
    
    createFilterTags()
  }

  const [openAllCounter, setOpenAllCounter] = useState(0);

  function openAll() {
    if (searchCloseVisibility === "block") {
      closeSearch();
    }

    var y = openAllCounter;
    ++y;
    setOpenAllCounter(y);

    if (y % 2 === 1) {
      setDesignerDisplayVisibility("block");
      setColorDisplayVisibility("block");
    } else {
      setDesignerDisplayVisibility("none");
      setColorDisplayVisibility("none");
    }
  }

  function clearAll() {
    setDesignerDisplayVisibility("none");
    setColorDisplayVisibility("none");
    setFilteringBrandsList([]);
    setFilteringColorList([]);
    setFilteredData([]);
    var v = [];
    baseAvailableBrandsToDisplay.map((object) => {
      v.push({ creator: object.creator, textDecoration: "none" });
      return null;
    });
    setAvailableBrandsToDisplay(v);
    setAvailableColorsToDisplay(baseAvailableColorsToDisplay);
    setDisplayData(Apidata.slice(0, 12));
    
    createFilterTags()
  }

  const search = (e) => {
    setDesignerDisplayVisibility("none");
    setColorDisplayVisibility("none");
    setFilteringBrandsList([]);
    setFilteringColorList([]);
    setFilteredData([]);
    var v = [];
    baseAvailableBrandsToDisplay.map((object) => {
      v.push({ creator: object.creator, textDecoration: "none" });
      return null;
    });
    setAvailableBrandsToDisplay(v);
    setAvailableColorsToDisplay(baseAvailableColorsToDisplay);
    setDisplayData(Apidata.slice(0, 12));

    var w = [];

    Apidata.map((object) => {
      if (
        object.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        object.colorname.toLowerCase().includes(e.target.value.toLowerCase()) ||
        object.creator.toLowerCase().includes(e.target.value.toLowerCase()) ||
        object.tag.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        w.push(object);
      }

      return null;
    });

    setFilteredData(w);

    setDisplayData(w.slice(0, 12));
  };

  const [searchVisibility, setSearchVisibility] = useState("none");
  const [searchIconVisibility, setSearchIconVisibility] = useState("block");
  const [searchCloseVisibility, setSearchCloseVisibility] = useState("none");
  const [searchOpacity, setSearchOpacity] = useState("transparent");
  const [searchValue, setSearchValue] = useState(null);

  const input1 = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 820) {
      setSearchOpacity("white");
      
    }
  }, [searchOpacity]);
  
  useEffect(() => {
    if (window.innerWidth <= 820) {
      
      
      if(colorDisplayVisibility === "none"){
        setFilterTagVisbility("none")
      } else {
        setFilterTagVisbility("flex")
      }
    }
  }, [colorDisplayVisibility])

  function openSearch() {
    setSearchOpacity("white");
    setFilteringBrandsList([]);
    setFilteringColorList([]);
    setFilteredData([]);
    var v = [];
    baseAvailableBrandsToDisplay.map((object) => {
      v.push({ creator: object.creator, textDecoration: "none" });
      return null;
    });
    setAvailableBrandsToDisplay(v);

    setDisplayData(Apidata.slice(0, 12));

    setDesignerDisplayVisibility("none");
    setColorDisplayVisibility("none");

    setSearchVisibility("block");
    setSearchIconVisibility("none");
    setSearchCloseVisibility("block");
    setTimeout(() => {
      input1.current.focus();
    }, 100);
    setSearchValue(null);
    
    createFilterTags()
  }

  function closeSearch() {
    if (window.innerWidth >= 820) {
      setSearchOpacity("transparent");
    }

    setSearchVisibility("none");
    setSearchCloseVisibility("none");
    setSearchIconVisibility("block");

    setFilteringBrandsList([]);
    setFilteringColorList([]);
    setFilteredData([]);
    var v = [];
    baseAvailableBrandsToDisplay.map((object) => {
      v.push({ creator: object.creator, textDecoration: "none" });
      return null;
    });
    setAvailableBrandsToDisplay(v);
    setAvailableColorsToDisplay(baseAvailableColorsToDisplay);
    setDisplayData(Apidata.slice(0, 12));

    var a = [];
    var b = [];

    Apidata.map((object) => {
      if (a.indexOf(object.creator.toLowerCase()) === -1) {
        a.push(object.creator.toLowerCase());
        b.push({
          creator: object.creator.toLowerCase(),
          textDecoration: "none",
        });
      }
      return null;
    });

    setAvailableBrandsToDisplay(b);

    var c = [];
    var d = [];

    Apidata.map((object) => {
      if (c.indexOf(object.colorname.toLowerCase()) === -1) {
        c.push(object.colorname.toLowerCase());
        d.push({
          colorname: object.colorname,
          backgroundColor: object.colordot,
          boxShadow: "0px 0px 0px 1px lightgray",
        });
      }
      return null;
    });

    setAvailableColorsToDisplay(d);

    setSearchValue("");
    
    createFilterTags()
  }
  
  const [filterTagList, setFilterTagList] = useState([])
  
  const [filterTagVisibility, setFilterTagVisbility] = useState("none")
  
  function createFilterTags(){
    setFilterTagVisbility("none")
    let x = []
    console.log(filteringBrandsList)
    filteringBrandsList.map(object => {
      x.push(object)
    })
    
    filteringColorList.map(object => {
      x.push(object)
    })
    
    setFilterTagList(x)
    setTimeout(() => {setFilterTagVisbility("flex")}, 10)
    
  }
  
  const removeFilterTag = e => {
  }


  return (
    <div onWheel={onScroll} onScroll={onScroll} className="body-container">
      <div className="colordisplay" style={{ display: colorDisplayVisibility }}>
        <div className="colordot-container-div">
          <div className="colordot-container">
            {availableColorsToDisplay.map((object) => {
              return (
                <span className="only-for-border">
                  <span
                    onClick={(e) => addColorToFilter(e)}
                    backgroundcolor={object.backgroundColor}
                    boxshadow={object.boxShadow}
                    colorname={object.colorname}
                    className="colordot"
                    style={{
                      backgroundColor: object.backgroundColor,
                      boxShadow: object.boxShadow,
                    }}
                  ></span>
                </span>
              );
            })}
          </div>
        </div>
        <div onClick={clearAll} className="colors-clear-all">
          Clear All
        </div>
      </div>
      <div style={{ display: designerDisplayVisibility }} className="designers">
        <div className="designers-search-div">
          <img
            alt=""
            className="brand-display-search-icon"
            src="//cdn.shopify.com/s/files/1/0493/5663/6318/t/181/assets/search-icon.svg?v=414742534810084488"
          />
          <input
            onChange={(e) => searchDesigners(e)}
            className="designers-search-input"
            type="text"
            placeholder="Search for designers..."
          />
        </div>
        <div className="designers-ul-div">
          <ul className="designers-ul">
            {availableBrandsToDisplay.map((object) => {
              return (
                <li
                  onClick={(e) => addBrandToFilter(e)}
                  brand={object.creator}
                  textdec={object.textDecoration}
                  className="designers-li"
                  style={{ textDecoration: object.textDecoration }}
                >
                  {object.creator.toUpperCase()}
                </li>
              );
            })}
          </ul>
        </div>
        <div onClick={clearAll} className="designers-clear-all">
          Clear All
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-left-menu-icon-div">
            <img
              alt=""
              className="navbar-left-menu-icon"
              src="//cdn.shopify.com/s/files/1/0493/5663/6318/t/181/assets/menu-burger.svg"
            />
          </div>
          <p className="navbar-left-p-first"> Men's </p>
          <p onClick={openDesignerDisplay} className="navbar-left-p">
            Designers
          </p>
          <p onClick={openColorDisplay} className="navbar-left-p">
            Colours
          </p>
          <p className="navbar-left-p black">
            <img
              className="discover-icon"
              src="https://cdn.shopify.com/s/files/1/0493/5663/6318/t/185/assets/explore-icon-new.svg"
              alt=" "
            />
            Explore
          </p>
        </div>
        <input
          value={searchValue}
          style={{ display: searchVisibility }}
          ref={input1}
          onChange={(e) => search(e)}
          className="searchbar-input"
          placeholder="search by designers, styles, etc..."
        ></input>
        <div
          className="navbar-center"
          style={{ backgroundColor: searchOpacity }}
        >
          <div onClick={openAll} className="navbar-center-filter-title">
            Browse
          </div>
        </div>
        <div className="navbar-right">
          <div className="navbar-right-search-icon-div">
            <img
              onClick={openSearch}
              alt=""
              className="navbar-right-search-icon"
              style={{ display: searchIconVisibility }}
              src="//cdn.shopify.com/s/files/1/0493/5663/6318/t/181/assets/search-icon.svg?v=414742534810084488"
            />
            <img
              onClick={closeSearch}
              alt=""
              className="navbar-right-close-search-icon"
              style={{ display: searchCloseVisibility }}
              src="//cdn.shopify.com/s/files/1/0493/5663/6318/t/181/assets/close-search.svg?v=13518895205651283720"
            />
          </div>
          <span className="navbar-right-upcoming">
            Upcoming
            <span className="navbar-right-upcoming-dot"></span>
          </span>
          <span className="navbar-right-saved">Saved</span>
          <span className="navbar-right-saved-counter">2</span>
        </div>
      </div>
      
      <div className="filter-tag-container" style={{display: filterTagVisibility}}>
      {filterTagList.map((object) => {
        return (
          <div 
            name={object}
            onClick={(e) => removeFilterTag(e)}
            className="filter-tag"
          >
            {object} <div name={object}
            onClick={(e) => removeFilterTag(e)} className="filter-tag-close"></div>
          </div>
        );
      })}
    </div>

      <div
        onScroll={onScroll}
        onWheel={onScroll}
        ref={listInnerRef}
        className="product-card-container"
        style={{ overflowY: "scroll" }}
      >
        {displayData.slice(0, 1).map((object) => (
          <div
            key={displayData.indexOf(object)}
            className="product-card"
            style={{ backgroundImage: `url(${object.image.src})` }}
          >
            <div className="product-card-hover">
              <div className="product-upper-description">
                <div className="product-title-status-color">
                  <p className="product-title">{object.title}</p>
                  <p className="product-status">{object.tag}</p>
                  <p
                    className="product-color-dot"
                    style={{ backgroundColor: `${object.colordot}` }}
                  ></p>
                </div>
                <div className="product-lovecounter-container">
                  <div>
                    <i className="far fa-heart heart-icon"></i>
                  </div>
                </div>
              </div>
              <div className="product-lower-description">
                <div className="product-creator">{object.creator}</div>
                <div className="product-price">
                  <span className="product-price-span">
                    {Math.ceil((object.price * 431) / 1000)}.000 Ft
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {displayData.slice(1, displayData.length + 1).map((object) => (
          <div
            key={displayData.indexOf(object)}
            className="product-card"
            style={{ backgroundImage: `url(${object.image.src})` }}
          >
            <div className="product-card-hover">
              <div className="product-upper-description">
                <div className="product-title-status-color">
                  <p className="product-title">{object.title}</p>
                  <p className="product-status">{object.tag}</p>
                  <p
                    className="product-color-dot"
                    style={{ backgroundColor: `${object.colordot}` }}
                  ></p>
                </div>
                <div className="product-lovecounter-container">
                  <div>
                    <i className="far fa-heart heart-icon"></i>
                  </div>
                </div>
              </div>
              <div className="product-lower-description">
                <div className="product-creator">{object.creator}</div>
                <div className="product-price">
                  <span className="product-price-span">
                    {Math.ceil((object.price * 431) / 1000)}.000 Ft
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sneakers;