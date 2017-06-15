using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using Xunit;

namespace Esf.DataAccess.DeploymentTests
{
    public class EsFiddleDbFixture
    {
        public EsFiddleDbFixture()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("dbDeployment.config.json")
                .Build();
            string esFiddleDbConnectionString = configuration.GetConnectionString("esFiddleDb");

            _database = new EsDatabaseClient(esFiddleDbConnectionString).Database;
        }

        private IMongoDatabase _database;

        public IMongoDatabase Database
        {
            get { return _database; }
        }

        public void WaitForConditionUntilTimeout(Func<bool> isConditionMet, Action verificationAction, string timeoutMessage)
        {
            TimeSpan timeoutSpan = new TimeSpan(0, 0, 0, 0, 5000);
            DateTime timeout = DateTime.Now.Add(timeoutSpan);
            do
            {
                if (isConditionMet())
                {
                    verificationAction();
                    return;
                }
                else
                    Thread.Sleep(100);
            }
            while (DateTime.Now < timeout);
            Assert.True(false, timeoutMessage);
        }
    }
}
