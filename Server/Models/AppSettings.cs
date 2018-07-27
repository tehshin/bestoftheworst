namespace BestOfTheWorst.Server.Models
{
    public class ConnectionStringSettings
    {
        public string Database { get; set; }
    }

    public class OAuthSetting
    {
        public string ClientId { get; set; }

        public string ClientSecret { get; set; }
    }

    public class OAuthSettings 
    {
        public OAuthSetting Google { get; set; }

        public OAuthSetting Twitter { get; set; }

        public OAuthSetting GitHub { get; set; }

        public OAuthSetting Microsoft { get; set; }
    }

    public class TheMovieDbSettings
    {
        public string ImageBaseUrl { get; set; }
    }

    public class AppSettings
    {
        public ConnectionStringSettings ConnectionStrings { get; set; }

        public TheMovieDbSettings MovieDb { get; set; }

        public OAuthSettings Authentication { get; set; }
    }
}