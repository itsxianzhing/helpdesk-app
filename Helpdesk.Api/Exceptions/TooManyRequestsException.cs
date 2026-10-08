using System.Net;

namespace Helpdesk.Exceptions;

public class TooManyRequestsException : AppException
{
    public TooManyRequestsException(string message)
        : base(message, (int)HttpStatusCode.TooManyRequests)
    {
    }
}