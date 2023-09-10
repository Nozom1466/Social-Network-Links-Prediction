// TODO: add user / organization dynamically

/*
* TOOLKIT
* */
function create_element(name, attr_list, attr_value) {
  /*
  * add element to html file
  *
  * @param {string}               name        CLASS name used for selector
  * @param {Array[string]}        attr_list   List of attributes
  * @param {Array[Array[string]]} attr_value  List of values in attributes listed in attr_list
  *
  * @return {Object}              return html element created
  * */

  if (attr_list.length !== attr_value.length) throw new Error("Length Err: list !== value")

  var entity = document.createElement(name)
  for (let i = 0;i < attr_list.length; i++) {
    var attributes = attr_value[i].join(" ")
    entity.setAttribute(attr_list[i], attributes)
  }

  return entity
}

function load_json(json_path) {
  /*
  * load json file into Promise Object
  * @param  json_path   {str}               path of json file
  * @return             {Promise Object}    The object holding the content of json
  * */
  return fetch(json_path)
  .then(response => response.json())
  .then(data => {
      return data;
  });
}

function round_num(value, decimal) {
  /*
  * @param  value     {float}     raw value
  * @param  decimal   {int}       accuracy
  * @return           {float}     rounded value
  * */
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

/*
* CANVAS INITIALIZATION
* */
function canvas_init(graph) {
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

  myChart.showLoading();
  myChart.hideLoading();
  graph.nodes.forEach(function (node) {
  node.label = {
    show: node.symbolSize > 0
  };
  });
  option = {
  title: {
    text: 'Social Network',
    subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  tooltip: {},
  legend: [
    {
      // selectedMode: 'single',
      data: graph.categories.map(function (a) {
        return a.name;
      })
    }
  ],
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      name: 'Social  Network',
      type: 'graph',
      layout: 'force',
      data: graph.nodes,
      draggable: true,
      links: graph.links,
      categories: graph.categories,
        force: {
        edgeLength: 100,
        repulsion: 100,
        gravity: 0.001
      },
      roam: true,
      label: {
        position: 'right',
        formatter: '{b}'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10
        }
      }
    }
  ]
  };
  myChart.setOption(option);

  return myChart
}


/*
* USER INFO LIST (left side-bar-1)
* */

function load_info(info, type) {
  var image_src;
  if (type === "user") {
    image_src = image_srcs[0]
  } else {
    image_src = image_srcs[1]
  }

  for (let i = 0; i < info.length; i++) {
    // img
    var img = create_element(
      'img',
      ['src', 'class', 'alt'],
      [
          [image_src],
          ["img-fluid", "rounded-start"],
          ["Kasaki Nozomi"]
    ])


    var img_box = create_element(
        'div',
        ['class'],
        [['col-md-4']]
    )

    img_box.appendChild(img)

    var small_text = create_element(
        'small',
        ['class'],
        [["text-body-secondary"]]
    )
    small_text.innerHTML = info[i].name

    var card_text = create_element(
        'p',
        ['class'],
        [["card-text"]]
    )

    card_text.appendChild(small_text)

    var card_title = create_element(
        'h5',
        ['class'],
        [["card-title", "user-info-card-name"]]
    )
    card_title.innerHTML = info[i].name;

    var card_body = create_element(
        'div',
        ['class'],
        [['card-body']]
    )
    card_body.appendChild(card_title)
    card_body.appendChild(card_text)

    var card_body_box = create_element(
        'div',
        ['class'],
        [['col-md-8']]
    )
    card_body_box.appendChild(card_body)

    var card_box = create_element(
        'div',
        ['class'],
        [['row', 'g-0']]
    )
    card_box.appendChild(img_box)
    card_box.appendChild(card_body_box)

    var type_mark;
    if (type === "user") {
      type_mark = ['card', 'mb-3', 'user-info-card']
    } else {
      type_mark = ['card', 'mb-3', 'user-info-card', 'organization-mark']
    }

    var card = create_element(
        'div',
        ['class', 'style'],
        [
            type_mark,
            ['max-width: 540px;']
        ]
    )
    card.appendChild(card_box)
    var info_list = document.querySelector(".user-info-content")
    info_list.appendChild(card)
  }

}

function clear_info() {
  var info_list = document.querySelector(".user-info-content")
  while(info_list.hasChildNodes()) {
      info_list.removeChild(info_list.firstChild);
  }
}

function shift_between_categories(user_list, organization_list, adjacency, dic_id2node, dic_name2id, category_name_list) {
  var tab_types = ["user", "organization"]
  var nav_tabs = document.querySelectorAll(".nav-link")

  for (let i = 0; i < nav_tabs.length; i++) {
    var tab = nav_tabs[i]
    tab.addEventListener('click', function(e) {
      var to_type;
      for (let j = 0; j < nav_tabs.length; j++) {
        if (nav_tabs[j].classList.contains("active")) {
          nav_tabs[j].classList.remove("active")
          to_type = 1 - j
          break;
        }
      }
      var click_tab = e.target
      click_tab.classList.add("active")
      clear_info()
      if (tab_types[to_type] === "user") {
        load_info(user_list, tab_types[to_type])
      } else {
        load_info(organization_list, tab_types[to_type])
      }
      bind_click_action_info_card(adjacency, dic_id2node, dic_name2id, category_name_list)
    })
  }
}

function bind_click_action_info_card(adjacency, dic_id2node, dic_name2id, category_name_list, myChart, graph) {
  var user_info_cards = document.querySelectorAll(".user-info-card")

  for (var i = 0; i < user_info_cards.length; i++) {
    user_info_cards[i].addEventListener("click", function (event) {
        // cards
        var current_card = event.currentTarget
        var detailed_info_content = document.querySelector(".detailed-info-content")

        // image
        var img_src = current_card.querySelector(".img-fluid").src
        detailed_info_content.querySelector(".card-img-top").src = img_src

        // title
        var name = current_card.querySelector(".user-info-card-name").innerHTML
        detailed_info_content.querySelector(".card-title").innerHTML = name

        // clear info in detail card && predictions
        clear_detailed_info()
        clear_prediction_info()

        load_detailed_card_info(name, adjacency, dic_id2node, dic_name2id, category_name_list, myChart, graph)

        // prediction button
        var prediction_form = detailed_info_content.querySelector(".prediction-selection-form")
        if (current_card.classList.contains("organization-mark")) {
          prediction_form.style.display = "none"
        } else {
          prediction_form.style.display = "block"
        }

        // highlight focused user
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: name
        })
    })
  }
}

/*
* USER DETAILED INFO (right side-bar-1)
* */
function bind_mode_action() {
  var selectOption = document.getElementById('mode-select');
  var inputField = document.getElementById('target_user_input');

  selectOption.addEventListener('change', function() {
    var selectedOption = selectOption.value;

    if (selectedOption === 'target') {
      inputField.style.display = 'block';
    } else {
      inputField.style.display = 'none';
    }
  });
}

function clear_detailed_info() {
  var detailed_info_list = document.querySelector(".detailed-info-content .list-group")
  while(detailed_info_list.hasChildNodes()) {
      detailed_info_list.removeChild(detailed_info_list.firstChild);
  }
}

function load_detailed_card_info(name, adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph) {
  var surrounding_dict = get_surroundings(name, adjacency, dict_id2node, dict_name2id, category_name_list)
  var detailed_card_info_list = document.querySelector(".detailed-info-content .list-group")

  var name_value = create_element(
        "div",
        ['class'],
        [["text-nowrap", "bg-body-secondary", "border"]]
  )
  name_value.innerHTML = name

  var name_head = create_element(
      "li",
      ["class"],
      [["list-group-item", "d-flex", "justify-content-between", "align-items-center"]]
  )

  name_head.innerHTML = "Name"
  name_head.appendChild(name_value)
  detailed_card_info_list.appendChild(name_head)

  for (var i = 0; i < category_name_list.length; i++) {
    var title;
    var content;
    if (surrounding_dict[category_name_list[i]].length > 0) {
      // item title
      title = category_name_list[i]
      if (title === "person" && dict_id2node[dict_name2id[name]].category === 0) title = "friends"
      else if (title === "person") title = "members"

      // item content
      /*TODO: hover -> completed version*/
      content = surrounding_dict[category_name_list[i]].map(function(item, index) {
        return dict_id2node[item].name
      })
      if (content.length > 3) {
        content = content.slice(0, 3)
        content.push("...")
      }
      content = content.join(" ")

      var value = create_element(
        "div",
        ['class'],
        [["text-nowrap", "bg-body-secondary", "border"]]
      )
      value.innerHTML = content

      var head = create_element(
          "li",
          ["class"],
          [["list-group-item", "d-flex", "justify-content-between", "align-items-center"]]
      )
      head.innerHTML = title
      head.appendChild(value)

      detailed_card_info_list.appendChild(head)
    }
  }
}

// WARNING CONTROL
function bind_input_warning(message) {
  var warning = document.querySelector(".warning-alert")
  warning.style.display = "block"
  warning.innerHTML = message
  window.setTimeout(function(){
      warning.style.display = "none"
  },2000)
}

function check_target_user_name(name, target, dict_name2id, dict_id2node) {
  if (target === "") {
    bind_input_warning("WARNING: Empty input")
    return false
  } else if (!(dict_name2id.hasOwnProperty(target))) {
    bind_input_warning("WARNING: No user matched")
    return false
  } else if (name === target){
    bind_input_warning("WARNING: Input a user not selected")
    return false
  } else if (dict_name2id.hasOwnProperty(target) && dict_id2node[dict_name2id[target]].category !== 0) {
    bind_input_warning("WARNING: Input a user but not an organization")
    return false
  }
  return true
}

function bind_click_action_prediction_button(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph) {
  var prediction_button = document.querySelector(".make-prediction-bt")


  prediction_button.addEventListener("click", function () {
    var detailed_info_content = document.querySelector(".detailed-info-content")
    var focused_name = detailed_info_content.querySelector(".card-title").innerHTML

    var algorithm = document.querySelector(".form-select-algorithm").value
    var mode = document.querySelector(".form-select-target").value
    var target_user = document.querySelector(".form-select-target-user").value
    // FIXME: Improve the structure of the following if-else !!!!
      var predictions;
      if (algorithm === "Algorithm" || algorithm === "1") {
        if (mode === "Mode" || mode === "all") {
          console.log(adjacency)
          predictions = algorithm_intersection_main(focused_name, adjacency, dict_id2node, dict_name2id, category_name_list)
          load_correlation_prediction(predictions)
        } else {
          if (check_target_user_name(focused_name, target_user, dict_name2id, dict_id2node)) {
            predictions = algorithm_intersection_target(focused_name, target_user, adjacency, dict_id2node, dict_name2id, category_name_list)
            load_correlation_prediction(predictions)
          }
        }
      } else if (algorithm === "2") {
        if (mode === "Mode" || mode === "all") {
          predictions = algorithm_IoU_main(focused_name, adjacency, dict_id2node, dict_name2id, category_name_list)
          load_correlation_prediction(predictions)
        } else {
          if (check_target_user_name(focused_name, target_user, dict_name2id, dict_id2node)) {
            predictions = algorithm_IoU_target(focused_name, target_user, adjacency, dict_id2node, dict_name2id, category_name_list)
            load_correlation_prediction(predictions)
          }
        }
      } else {
        console.log(mode)
        if (mode === "Mode" || mode === "all") {
          predictions = algorithm_nx_related(focused_name, adjacency, dict_id2node, dict_name2id, category_name_list, algorithm, graph)
          load_correlation_prediction(predictions)
        } else {
          if (check_target_user_name(focused_name, target_user, dict_name2id, dict_id2node)) {
            predictions = algorithm_nx_related_target(focused_name, target_user, adjacency, dict_id2node, dict_name2id, category_name_list, algorithm, graph)
            load_correlation_prediction(predictions)
          }
        }
      }

      bind_hover_action_prediction_items(focused_name, adjacency, dict_name2id, dict_id2node, myChart)
  })

}


/*
* LOAD DATA CARD (left side-bar-2)
* */
function bind_dataset_loading(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph) {
  var default_button = document.querySelector(".load-default")
  var custom_button = document.querySelector(".load-custom")

  function default_button_wrapper(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph) {
    return function() {
      var model = document.getElementById("fileUploadModel")
      var title = model.querySelector(".modal-title")
      title.innerHTML = "Default"
      var content = model.querySelector(".modal-body")
      content.innerHTML = "Default JSON file loaded."

      var ok_bt = model.querySelector(".OK-bt")
      ok_bt.style.display = "none"
      ok_bt.addEventListener("click", function () {
      })

      init(DEFAULT_JSON_SEQ)

      load_count += 1

      // NOTICE: Recreating make predictions button is essential as prediction bt event listener could only be updated after it was recreated...
      var prediction_bt = document.querySelector(".make-prediction-bt")
      var pred_parent = prediction_bt.parentNode
      pred_parent.removeChild(prediction_bt)

      var new_prediction_bt = create_element(
          'button',
          ['class', 'type'],
          [["btn", "btn-primary", "make-prediction-bt"], ['submit']]
      )
      new_prediction_bt.innerHTML = "Make Predictions"
      pred_parent.appendChild(new_prediction_bt)
      bind_click_action_prediction_button(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)

      bind_dataset_loading(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)
    }
  }

  function custom_button_wrapper(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph) {
    return function() {
      var model = document.getElementById("fileUploadModel")
      var title = model.querySelector(".modal-title")
      title.innerHTML = "Custom"

      // file upload
      var label = create_element(
          'label',
          ['for', 'class'],
          [["formFile"], ["form-label"]]
      )
      label.innerHTML = "Upload your File: "

      var input = create_element(
          'input',
          ['class', 'type', 'id'],
          [["form-control"], ["file"], ["formFile"]]
      )

      var wrap = create_element(
          'div',
          ['class'],
          [["mb-3"]]
      )
      // FIXME: cannot continuously load custom data (default -> custom -> default)
      /*FIXME: Server Error :
      * focused = data["info"]["focused_id"]
        KeyError: 'focused_id'
        suspect that the issue is similar to previous one (adjacency matrix hasn't been updated and stuff...)
      * */

      var content = model.querySelector(".modal-body")

      if (load_count === 0) {
        wrap.appendChild(label)
        wrap.appendChild(input)
        while(content.hasChildNodes()) {
          content.removeChild(content.firstChild);
        }
      } else {
        while(content.hasChildNodes()) {
          content.removeChild(content.firstChild);
        }
        wrap.innerHTML = "Please refresh the browser and load your custom data again..."
      }
      content.appendChild(wrap)

      // file reading && writing
      var ok_bt = model.querySelector(".OK-bt")
      if (load_count === 0) {
        ok_bt.style.display = "block"
      } else {
        ok_bt.style.display = "none"
      }

      ok_bt.addEventListener("click", function() {
        load_count += 1
        let file = input.files[0]
        let file_name = save_file_to_server(file)
        graph_json_srcs.push(static_json_folder + "/"+ file_name)
        let user_upload_index = graph_json_srcs.indexOf(static_json_folder + "/"+ file_name)

        init(user_upload_index)

        // NOTICE: Recreating make predictions button is essential as prediction bt event listener could only be updated after it was recreated...
        var prediction_bt = document.querySelector(".make-prediction-bt")
        var pred_parent = prediction_bt.parentNode
        pred_parent.removeChild(prediction_bt)

        var new_prediction_bt = create_element(
            'button',
            ['class', 'type'],
            [["btn", "btn-primary", "make-prediction-bt"], ['submit']]
        )
        new_prediction_bt.innerHTML = "Make Predictions"
        pred_parent.appendChild(new_prediction_bt)
        bind_click_action_prediction_button(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)

        // bind_dataset_loading(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)


      })
    }
  }

  default_button.addEventListener("click", default_button_wrapper(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph))

  custom_button.addEventListener("click", custom_button_wrapper(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph))

}

function save_file_to_server(file) {
  var file_name;
  $.ajax({
    url: '/save_file/',
    type: 'POST',
    data: file,
    async:false,
    headers: {'X-CSRFToken': csrfmiddlewaretoken},
    processData: false,
    content_type: 'application/json',
    success: function(response) {
      file_name = response["filename"]
    },
    error: function(xhr, textStatus, error) {
      console.log('Error:', error);
    }
  });

  return file_name
}


/*
* PREDICTION LIST (right side-bar-2)
* */
function clear_prediction_info() {
  var prediction_info_list = document.querySelector(".prediction-tbody")
  while(prediction_info_list.hasChildNodes()) {
      prediction_info_list.removeChild(prediction_info_list.firstChild);
  }
}

function load_correlation_prediction(prediction) {
  /*
  * render predictions
  *
  * @param {Array[Array[string, number]]}
  * */
  clear_prediction_info()
  for (var i = 0; i < prediction.length; i++) {
    var color_list = [
        "#FFD700",
        "#C0C0C0",
        "#C47222"
    ]

    var badge = document.createElement('span')
    badge.setAttribute('class', "badge")
    var badge_bg_color = "#f0f1f2"
    if (i < 3) badge_bg_color = color_list[i]
    badge.setAttribute('style', `background-color: ${badge_bg_color};color: #000;`)
    badge.innerHTML = (i + 1).toString();

    var th = document.createElement('th')
    th.setAttribute('scope', "row")
    th.appendChild(badge)

    var td_name = document.createElement('td')
    td_name.innerHTML = prediction[i][0]
    td_name.setAttribute("class", "prediction-item-name")
    var td_corr = document.createElement('td')
    td_corr.innerHTML = prediction[i][1].toString()

    var tr = document.createElement('tr')
    tr.setAttribute("class", "prediction-item")
    tr.appendChild(th)
    tr.appendChild(td_name)
    tr.appendChild(td_corr)

    var prediction_tbody = document.querySelector('.prediction-tbody')
    prediction_tbody.appendChild(tr)
  }
}

function get_intersection(focused, target, adjacency, dict_name2id, dict_id2node) {
  var range_1 = adjacency[dict_name2id[focused]]
  var range_2 = adjacency[dict_name2id[target]]
  var intersection = range_1.filter(item => {
    return range_2.includes(item)
  })
  return intersection.map(function(item, index) {
    return dict_id2node[item].name
  })
}

function bind_hover_action_prediction_items(focused_name, adjacency, dict_name2id, dict_id2node, myChart) {
  var prediction_items = document.querySelectorAll(".prediction-item")
  for (var i = 0; i < prediction_items.length; i++) {
    prediction_items[i].addEventListener("mouseenter", function(e) {
      var currentItem = e.currentTarget
      var target_name = currentItem.querySelector(".prediction-item-name").innerHTML
      var intersection = get_intersection(focused_name, target_name, adjacency, dict_name2id, dict_id2node)

      var options = myChart.getOption()
      var radiate_source = [focused_name, target_name]
      options.series[0].links.forEach((link) => {
        if (
            radiate_source.includes(dict_id2node[link.source].name) && intersection.includes(dict_id2node[link.target].name) ||
            radiate_source.includes(dict_id2node[link.target].name) && intersection.includes(dict_id2node[link.source].name)
        ) {
          link.lineStyle = {
            width: 1,
          }
        } else {
          link.lineStyle = {
            width: 0.1,
          }
        }
      })

      intersection.push(target_name)
      intersection.push(focused_name)

      options.series[0].data.forEach((node) => {
        if (intersection.includes(node.name)) {
          node.itemStyle = {
            opacity: 1,
          }

        } else {
          node.itemStyle = {
            opacity: 0.1
          };
        }
      })
      myChart.setOption(options);
    })

    prediction_items[i].addEventListener("mouseleave", function(e) {
      var currentItem = e.currentTarget
      var target_name = currentItem.querySelector(".prediction-item-name").innerHTML
      var intersection = get_intersection(focused_name, target_name, adjacency, dict_name2id, dict_id2node)

      var options = myChart.getOption()

      options.series[0].links.forEach((link) => {
        link.lineStyle = {
            width: 1,
          }
      })

      intersection.unshift(target_name)
      intersection.unshift(focused_name)

      options.series[0].data.forEach((node) => {
        node.itemStyle = {
            opacity: null
        }
      })
      myChart.setOption(options);
    })
  }
}

/*
* SEARCH ALGORITHM
* */

function get_dicts(nodes) {
  var dic_id2node = []
  var dic_name2id = []

  for (var i = 0;i < nodes.length; i++) {
    dic_id2node[nodes[i].id] = nodes[i]
    dic_name2id[nodes[i].name] = nodes[i].id
  }

  return [dic_id2node, dic_name2id]
}

function get_adjacency_list(links, nodes) {
  var adjacency = []

  for (var i = 0; i < nodes.length; i++) {
    adjacency[nodes[i].id] = []
  }
  var source;
  var target;
  for (var j = 0; j < links.length; j++) {
    source = links[j].source
    target = links[j].target

    adjacency[source].push(target)
    adjacency[target].push(source)
  }
  return adjacency
}

function get_surroundings(name, adjacency, dict_id2node, dict_name2id, category_name_list) {
  /*
  * @return {cate1: [id1, id2, ...], cate2: [], ...}
  * */
  var name_id = dict_name2id[name]
  var surroundings = adjacency[name_id]

  var surrounding_dict = []
  for (var j = 0;j < category_name_list.length; j++) {
    surrounding_dict[category_name_list[j]] = []
  }

  for (var i = 0;i < surroundings.length; i++) {
    var cate_id = dict_id2node[surroundings[i]].category
    surrounding_dict[category_name_list[cate_id]].push(surroundings[i])
  }

  return surrounding_dict
}

function get_dataIndex(nodes, links) {
  var dataIndex = 0
  var dict_name2dataIndex = []
  for (var i = 0; i < nodes.length; i++) {
    dict_name2dataIndex[nodes[i].id] = dataIndex
    dataIndex++
  }
  dataIndex = 0
  for (var j = 0; j < links.length; j++) {
    dict_name2dataIndex[`${links[j].source} > ${links[j].target}`] = dataIndex
    dataIndex++
  }

  return dict_name2dataIndex
}

/*
* ALGORITHM: Weighted intersection nodes
* */

function algorithm_intersection_main(name, adjacency, dict_id2node, dict_name2id, category_name_list) {
  /*
  * @return [[name, correlation], [name, correlation], ...] (sorted by correlation)
  * */
  var name_id = dict_name2id[name]
  var surrounding_dict = get_surroundings(name, adjacency, dict_id2node, dict_name2id, category_name_list)
  var results = []

  for (var key in adjacency) {
    var result = []
    // not name itself nor organizations nor the friends of name
    if (key !== name_id && dict_id2node[key].category === 0 && !(surrounding_dict["person"].includes(key))) {
      var node_surrounding_dict = get_surroundings(dict_id2node[key].name, adjacency, dict_id2node, dict_name2id, category_name_list)
      result['name'] = dict_id2node[key].name
      for (var i = 0; i < category_name_list.length; i++) {
        result[category_name_list[i]] = 0
        var intersection = surrounding_dict[category_name_list[i]].filter(item => {
          return node_surrounding_dict[category_name_list[i]].includes(item)
        })
        result[category_name_list[i]] = intersection.length
      }

      var count = 0;
      for (var j = 0; j < category_name_list.length; j++) {
        count += result[category_name_list[j]]
      }
      if (count > 0) {
        results.push(result)
      }
    }
  }

  var weights = {}
  console.log(category_name_list)
  for (var t = 0; t < category_name_list.length; t++) {
    weights[category_name_list[t]] = 0.3
  }


  var prediction = algorithm_intersection_calc_results(results, weights, category_name_list)

  return prediction
}

function algorithm_intersection_target(name, target, adjacency, dict_id2node, dict_name2id, category_name_list) {
  var surrounding_dict = get_surroundings(name, adjacency, dict_id2node, dict_name2id, category_name_list)
  var results = []
  var result = []

  var node_surrounding_dict = get_surroundings(target, adjacency, dict_id2node, dict_name2id, category_name_list)
  result['name'] = target
  for (var i = 0; i < category_name_list.length; i++) {
    result[category_name_list[i]] = 0
    var intersection = surrounding_dict[category_name_list[i]].filter(item => {
      return node_surrounding_dict[category_name_list[i]].includes(item)
    })
    result[category_name_list[i]] = intersection.length
  }
  results.push(result)

  var weights = {}
  console.log(category_name_list)
  for (var t = 0; t < category_name_list.length; t++) {
    weights[category_name_list[t]] = 0.3
  }

  var prediction = algorithm_intersection_calc_results(results, weights, category_name_list)

  return prediction

}

function algorithm_intersection_compare(pos) {
  return function (a, b) {
    return b[pos] - a[pos]
  }
}

function algorithm_intersection_calc_results(results, weights, category_name_list) {
  /*
  * @return [[name, correlation], [name, correlation], ...] (sorted by correlation)
  * */
  var prediction = []

  var score = 0;
  for (var i = 0;i < results.length; i++) {
    var result = results[i]
    var item = [result.name]
    score = 0
    for (var j = 0; j < category_name_list.length; j++) {
      score += result[category_name_list[j]] * weights[category_name_list[j]]
    }
    item.push(round_num(score, 3))
    prediction.push(item)
  }

  prediction.sort(algorithm_intersection_compare(1))

  return prediction
}

/*
* ALGORITHM: IoU
* */
function algorithm_IoU_main(name, adjacency, dict_id2node, dict_name2id, category_name_list){
  var name_id = dict_name2id[name]
  var name_surrounding = adjacency[name_id]
  var results = []

  for (var key in adjacency) {
    if (key !== name_id && dict_id2node[key].category === 0 && !(name_surrounding.includes(key))) {
      var target_surrounding = adjacency[key]
      var score = algorithm_IoU_calc(name_surrounding, target_surrounding)
      if (score > 0) {
        results.push([dict_id2node[key].name, score])
      }
    }
  }

  results.sort(algorithm_IoU_compare(1))
  var prediction = results.map(function(item, index) {
    return [item[0], round_num(item[1], 3)]
  })

  return prediction

}

function algorithm_IoU_target(name, target, adjacency, dict_id2node, dict_name2id, category_name_list) {
  var name_id = dict_name2id[name]
  var name_surrounding = adjacency[name_id]
  var results = []

  var target_surrounding = adjacency[dict_name2id[target]]
  var score = algorithm_IoU_calc(name_surrounding, target_surrounding)

  results.push([target, score])
  var prediction = results.map(function(item, index) {
    return [item[0], round_num(item[1], 3)]
  })

  return prediction
}

function algorithm_IoU_compare(pos) {
  return function (a, b) {
    return b[pos] - a[pos]
  }
}

function algorithm_IoU_calc(list_1, list_2) {
  var intersection = list_1.filter(item => {
    return list_2.includes(item)
  })

  var intersection_len = intersection.length
  var union_len = list_1.length + list_2.length - intersection_len
  if (union_len === 0) union_len = 1

  return intersection_len / union_len
}

/*
* ALGORITHM: networkx {Adamic-Adar-index, Common_Neighbor_Centrality}
* */
// references:
// Adamic-Adar-index: https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_prediction.adamic_adar_index.html#networkx.algorithms.link_prediction.adamic_adar_index
// Common_Neighbor_Centrality: https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_prediction.common_neighbor_centrality.html#networkx.algorithms.link_prediction.common_neighbor_centrality

function algorithm_nx_related(name, adjacency, dict_id2node, dict_name2id, category_name_list, type, graph) {
  /*
  * @param  type  {string}  {"3": Adamic-Adar-index, "4": Common_Neighbor_Centrality}
  * */
  // FIXME: file name passed to backend rather than json file
  graph["info"] = {
    "algo": type,
    "focused_id": dict_name2id[name],
    "target_id": "-1"
  }

  var results;
  $.ajax({
    url: '/ajax-add/',
    async:false,
    method: "POST",
    headers: {'X-CSRFToken': csrfmiddlewaretoken},
    content_type: 'application/json',
    data: JSON.stringify(graph),
    success: function (data) {
      results = data
    }
  })

  // FIXME: prediction made on all nodes including organizations thus key could be id of organizations...
  var prediction = []
  for (var key in results) {
    if (dict_id2node[key].category === 0)
      prediction.push([dict_id2node[key].name, round_num(results[key], 3)])
  }

  prediction.sort(algorithm_nx_related_compare(1))

  return prediction
}

function algorithm_nx_related_target(name, target, adjacency, dict_id2node, dict_name2id, category_name_list, type, graph) {
  /*
  * @param  type  {string}  {"3": Adamic-Adar-index, "4": Common_Neighbor_Centrality}
  * */
  // FIXME: file name passed to backend rather than json file
  graph["info"] = {
    "algo": type,
    "focused_id": dict_name2id[name],
    "target_id": dict_name2id[target]
  }

  var results;
  $.ajax({
    url: '/ajax-add/',
    async:false,
    method: "POST",
    headers: {'X-CSRFToken': csrfmiddlewaretoken},
    content_type: 'application/json',
    data: JSON.stringify(graph),
    success: function (data) {
      results = data
    }
  })

  // FIXME: prediction made on all nodes including organizations thus key could be id of organizations...
  var prediction = []
  for (var key in results) {
    if (dict_id2node[key].category === 0)
      prediction.push([dict_id2node[key].name, round_num(results[key], 3)])
  }

  return prediction
}

function algorithm_nx_related_compare(pos) {
  return function (a, b) {
    return b[pos] - a[pos]
  }
}


/*
* INITIALIZATION
* */
function init(json_seq) {
  load_json(graph_json_srcs[json_seq]).then(graph => {

    clear_info()
    clear_detailed_info()
    clear_prediction_info()

    // canvas initialization
    var myChart = canvas_init(graph)

    var nodes = graph.nodes
    var links = graph.links
    var categories = graph.categories

    var name_list_length = categories[0].number
    var name_list = nodes.slice(0, name_list_length)
    var organization_list = nodes.slice(name_list_length, nodes.length)


    // get dicts
    var dicts = get_dicts(nodes)
    var dict_id2node = dicts[0]
    var dict_name2id= dicts[1]
    var adjacency = get_adjacency_list(links, nodes)
    var dict_name2dataIndex = get_dataIndex(nodes, links)

    var category_name_list = []
    for (var i = 0; i < categories.length; i++) {
      category_name_list.push(categories[i].name)
    }

    // card for item list
    load_info(name_list, "user")
    shift_between_categories(name_list, organization_list, adjacency, dict_id2node, dict_name2id, category_name_list)

    // card for file loading
    bind_dataset_loading()

    // card for choice
    bind_click_action_info_card(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)

    // card for detailed info
    bind_mode_action(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)

    // card for predictions
    bind_click_action_prediction_button(adjacency, dict_id2node, dict_name2id, category_name_list, myChart, graph)
  })
}

init(DEFAULT_JSON_SEQ)



