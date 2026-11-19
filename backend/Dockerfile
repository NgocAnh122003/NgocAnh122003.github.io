# Bước 1: build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY Dvna.Api.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# Bước 2: chạy ứng dụng (ảnh nhỏ gọn, không chứa bộ build)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .
# Render chuyển request vào cổng 10000
ENV ASPNETCORE_HTTP_PORTS=10000
EXPOSE 10000
USER app
ENTRYPOINT ["dotnet", "Dvna.Api.dll"]
