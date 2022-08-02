// 一个跳棋从0开始跳，每次跳的距离是这次跳的次数，但是可以往左跳或者往右跳，求能跳到目标数字的最小次数，已经如何跳
// https://www.bilibili.com/video/BV1RT4y1a7aK?p=2&vd_source=1cc94cfa967165dae4b754ea6f349a35
// https://leetcode.com/problems/reach-a-number/

function getSteps(target) {
	function isOdd(num) {
		return num % 2 === 1;
	}

	let sum = 0,
		i = 0;
	arr = [];
	while (sum < target || isOdd(sum) !== isOdd(target)) {
		i++;
		sum += i;
	}

	let dist = sum - target;
	if (dist === 0) return arr;

	for (var k = i; k > 0; k--) {
		if (dist >= 2 * k) {
			arr.push(k);
			dist -= 2 * k;
			continue;
		}
		if (dist === 0) break;
	}

	return arr;
}

console.log(getSteps(11));
