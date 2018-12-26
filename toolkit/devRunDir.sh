printf "请输入要执行的目录："
read name

dir=''

if [ !${name} ]
then
  dir="--dir ${name}"
fi

echo "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js ${dir}"

webpack-dev-server --inline --progress --config build/webpack.dev.conf.js ${dir}
