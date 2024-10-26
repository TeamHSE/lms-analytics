using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddDataCompanies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.InsertData(
				table: "Companies",
				columns: new[] { "Id", "Companyname" },
				values: new object[,]
				{
					{ 1, "ИнноваПлюс" },
					{ 2, "Универсум" },
					{ 3, "КреативЛаб" },
					{ 4, "ЗнаниеТек"},
					{ 5, "Академия Будущего"}
				});
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
