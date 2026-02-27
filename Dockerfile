# 基于轻量的nginx alpine镜像
FROM nginx

# 创建指定的静态资源目录
RUN mkdir -p /opt/goldwind/sxshu

# 清空nginx默认静态目录（可选，避免干扰）
RUN rm -rf /usr/share/nginx/html/*

# 复制前端dist目录到指定路径
COPY dist/ /opt/goldwind/sxshu/

# 复制public目录到指定路径（如果有）
COPY public/ /opt/goldwind/sxshu/public/

# 替换nginx默认配置为自定义配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露8099端口（与nginx.conf一致）
EXPOSE 8099

# 前台启动nginx（容器必须前台运行）
CMD ["nginx", "-g", "daemon off;"]