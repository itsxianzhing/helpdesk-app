# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file
COPY Helpdesk.Api.csproj .

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY . .

# Publish application
RUN dotnet publish -c Release -o /app/publish


# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

RUN apt-get update \
    && apt-get install -y --no-install-recommends libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy published application
COPY --from=build /app/publish .

# ASP.NET Core listens on port 8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Helpdesk.Api.dll"]