$(function () {
  // 搜索返回的结果
  let res

  // 选中方框
	function selectSong(sel) {
		$(sel).hide().next().show().css('position', 'static')
	}
	// 取消选中方框
	function noSelectSong(sel) {
		$(sel).hide().prev().show()
	}
	// 搜索添加歌曲
	function getSong() {
		let value = $(this).prev().val()
		// 搜索歌曲信息
		if (value) {
			$.ajax({
				type: 'get',
				url: `https://autumnfish.cn/search?keywords=${value}`,
				success: function (response) {
          // 将结果传出
          res = response
					// 成功后生成dom并展示
					let lists = ''
					for (let i = 0; i < response.result.songs.length; i++) {
						let time = (response.result.songs[i].duration / 60000).toFixed(2)
						let dom = `<ul>
              <li class="song_section">
                <i class="iconfont icon-zhengfangxing"></i>
                <i class="iconfont icon-zhengfangxingxuanzhongzhuangtai"></i>
              </li>
              <li class="song_status"><img src="img/wave.gif"><span>${i + 1}.</span></li>
              <li class="song_name">${response.result.songs[i].name}</li>
              <li class="song_option">
                <i class="iconfont">&#xe651;</i>
                <i class="iconfont">&#xe607;</i>
                <i class="iconfont">&#xe62a;</i>
                <i class="iconfont">&#xe8bc;</i>
              </li>
              <li class="song_author">${value}</li>
              <li class="song_time"><i class="iconfont">&#xe751;</i><span>${time}</span></li>
             </ul>`
						lists += dom
					}
					$('#mCSB_1_container').append(lists)
				},
				error: function (xhr, status, error) {
					console.log(error)
				}
			})
		} else {
			alert('请输入内容')
		}
  }
  



	// 1.初始化滚动插件
	;(function ($) {
		$(window).on('load', function () {
			$('.song_rows').mCustomScrollbar()
		})
	})(jQuery)

	// 2.点击选择歌曲
	$('main').delegate('i', 'click', function () {
		// 采用事件代理,判断当前选择元素的display是否为inline
		// 因为选中方框后其display变为block,再次点击会触发else
		if ($(this).css('display') === 'inline') {
			selectSong(this)
			// 如果点选的是全选按钮未选中状态,将所有按钮选中
			if ($(this).attr('class').indexOf('no_select') !== -1) {
				selectSong($('.song_section i:first-child'))
			}
		} else {
			noSelectSong(this)
			// 如果点选的是全选按钮已选中空状态,将所有按钮取消选中
			if ($(this).attr('class').indexOf('total_select') !== -1) {
				noSelectSong($('.song_section i:last-child'))
			}
		}

		// 每次点击时判断:如果所有按钮选中,则选中全选按钮.一个按钮没选中,全选按钮不选中(遍历)
		// sel默认为true即执行全选选中
		// 但只要有一个方框没选中,该值变为false,不执行全选按钮
		let sel = true
		$('.song_rows .song_section i:first-child').each(function (i, v) {
			if ($(v).css('display') === 'inline') {
				// 只要有一个为inline说明这个没有选中
				// 所以全选按钮不选中
				sel = false
				noSelectSong($('.total_select'))
				return false
			}
		})
		if (sel) {
			selectSong($('.no_select'))
		}
	})

	// 3.点击搜索歌曲或者回车键搜索
	$('button').click(getSong)
	document.onkeydown = function (event) {
		var e = event || window.event || arguments.callee.caller.arguments[0]
		if (e && e.keyCode === 13) {
			$('button').trigger('click')
		}
  }
  
  // 4.选择歌曲显示信息(背景,右侧封面)

  $('main').delegate('.song_rows ul', 'click',function () { 
    let index = $(this).find('.song_status span').text() - 1
    $('.song_img div').css('background', `url(${res.result.songs[index].artists[0].img1v1Url})`)
    $('.song_info .song_name .right').text(`${res.result.songs[index].name}`)
    $('.song_info .singer_name .right').text(`${res.result.songs[index].artists[0].name}`)
    $('.song_info .album_name .right').text(`${res.result.songs[index].album.name}`)
   })





	
})
